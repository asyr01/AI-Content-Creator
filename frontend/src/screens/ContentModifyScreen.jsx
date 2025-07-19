import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Badge, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import Message from '../components/Message';

const ContentModifyScreen = () => {
  const [formData, setFormData] = useState({
    title: '',
    language: 'English',
    tone: 'professional',
    originalContent: '',
    modificationType: 'rephrase'
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  const languages = [
    'English', 'German', 'French', 'Spanish', 'Italian', 'Portuguese', 
    'Japanese', 'Chinese', 'Hindi', 'Arabic'
  ];

  const tones = [
    'persuasive', 'professional', 'friendly', 'casual', 'formal', 
    'enthusiastic', 'informative'
  ];

  const modificationTypes = [
    { value: 'elaborate', label: 'Elaborate', description: 'Expand with richer details and examples' },
    { value: 'summarize', label: 'Summarize', description: 'Compress into a concise summary' },
    { value: 'rephrase', label: 'Rephrase', description: 'Reword to improve tone and clarity' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.originalContent) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/content/modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to modify content';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleContent = () => {
    setFormData(prev => ({
      ...prev,
      originalContent: "Our new tablet has a good battery life and a decent screen resolution. It's perfect for everyday use."
    }));
  };

  return (
    <>
      <Meta title="Content Modification - AI Content Creator" />
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <Card>
              <Card.Header>
                <h2 className="mb-0">🔄 Content Modification</h2>
                <small className="text-muted">
                  Transform your existing content - elaborate, summarize, or rephrase
                </small>
              </Card.Header>
              <Card.Body>
                {error && <Message variant="danger">{error}</Message>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Product Description Revision"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Language *</Form.Label>
                        <Form.Select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          required
                        >
                          {languages.map(language => (
                            <option key={language} value={language}>{language}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Desired Tone *</Form.Label>
                        <Form.Select
                          name="tone"
                          value={formData.tone}
                          onChange={handleInputChange}
                          required
                        >
                          {tones.map(tone => (
                            <option key={tone} value={tone}>
                              {tone.charAt(0).toUpperCase() + tone.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Modification Type *</Form.Label>
                    <Form.Select
                      name="modificationType"
                      value={formData.modificationType}
                      onChange={handleInputChange}
                      required
                    >
                      {modificationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {modificationTypes.find(t => t.value === formData.modificationType)?.description}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label>Original Content *</Form.Label>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={handleSampleContent}
                      >
                        Use Sample
                      </Button>
                    </div>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="originalContent"
                      value={formData.originalContent}
                      onChange={handleInputChange}
                      placeholder="Paste your existing content here that you want to modify..."
                      required
                    />
                    <Form.Text className="text-muted">
                      {formData.originalContent.length} characters
                    </Form.Text>
                  </Form.Group>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      variant="success" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Modifying Content...
                        </>
                      ) : (
                        `${modificationTypes.find(t => t.value === formData.modificationType)?.label} Content`
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {result && (
              <Card className="mt-4">
                <Card.Header>
                  <h4 className="mb-0">Modified Content</h4>
                  <small className="text-muted">
                    Project: {result.project?.title || 'Modified Content'} | Action: {formData.modificationType}
                  </small>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>Original Content:</h6>
                      <div 
                        className="p-3 bg-light border rounded mb-3"
                        style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                      >
                        {result.originalContent}
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6>Modified Content:</h6>
                      <div 
                        className="p-3 bg-success bg-opacity-10 border border-success rounded mb-3"
                        style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                      >
                        {result.modifiedContent}
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-3 text-center">
                    <Button 
                      variant="success" 
                      onClick={() => navigate('/projects')}
                      className="me-2"
                    >
                      View All Projects
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setResult(null)}
                    >
                      Modify Another
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContentModifyScreen;
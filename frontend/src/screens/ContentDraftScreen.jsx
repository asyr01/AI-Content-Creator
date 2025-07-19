import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Badge, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import Message from '../components/Message';

const ContentDraftScreen = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: 'Germany',
    language: 'English',
    tone: 'professional',
    category: 'Technology',
    contentIntent: '',
    desiredLength: '300-400 words'
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

  const locations = [
    'Germany', 'United States', 'United Kingdom', 'France', 'Italy', 
    'Spain', 'Japan', 'Canada', 'Australia', 'Brazil', 'India', 'China'
  ];

  const languages = [
    'English', 'German', 'French', 'Spanish', 'Italian', 'Portuguese', 
    'Japanese', 'Chinese', 'Hindi', 'Arabic'
  ];

  const tones = [
    'persuasive', 'professional', 'friendly', 'casual', 'formal', 
    'enthusiastic', 'informative'
  ];

  const categories = [
    'luxury', 'apparel', 'Technology', 'fashion', 'toys', 
    'home-garden', 'sports', 'beauty', 'automotive', 'books'
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
    
    if (!formData.title || !formData.contentIntent) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/content/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate content';
        
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

  return (
    <>
      <Meta title="Content Drafting - AI Content Creator" />
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <Card>
              <Card.Header>
                <h2 className="mb-0">✍️ Content Drafting</h2>
                <small className="text-muted">
                  Create new content from scratch using trending keywords and market insights
                </small>
              </Card.Header>
              <Card.Body>
                {error && <Message variant="danger">{error}</Message>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Project Title *</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Smart Home Blog Post"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Target Location *</Form.Label>
                        <Form.Select
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        >
                          {locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

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
                        <Form.Label>Tone *</Form.Label>
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

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Desired Length</Form.Label>
                        <Form.Select
                          name="desiredLength"
                          value={formData.desiredLength}
                          onChange={handleInputChange}
                        >
                          <option value="150-200 words">Short (150-200 words)</option>
                          <option value="300-400 words">Medium (300-400 words)</option>
                          <option value="500-700 words">Long (500-700 words)</option>
                          <option value="800-1000 words">Extended (800-1000 words)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Content Intent / Purpose *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="contentIntent"
                      value={formData.contentIntent}
                      onChange={handleInputChange}
                      placeholder="e.g., Promotional blog post about smart home devices, product description for wireless headphones, social media campaign for summer fashion..."
                      required
                    />
                    <Form.Text className="text-muted">
                      Describe what type of content you want to create and its purpose
                    </Form.Text>
                  </Form.Group>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Generating Content...
                        </>
                      ) : (
                        'Generate Content Draft'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {result && (
              <Card className="mt-4">
                <Card.Header>
                  <h4 className="mb-0">Generated Content</h4>
                  <small className="text-muted">
                    Project: {result.project?.title || 'Generated Content'}
                  </small>
                </Card.Header>
                <Card.Body>
                  {result.trendingKeywords && result.trendingKeywords.length > 0 && (
                    <div className="mb-3">
                      <h6>Trending Keywords Used:</h6>
                      {result.trendingKeywords.map((keyword, index) => (
                        <Badge key={index} bg="info" className="me-2">
                          {keyword.keyword} ({keyword.interest}%)
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <h6>Generated Content:</h6>
                    <div 
                      className="p-3 bg-light border rounded"
                      style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                    >
                      {result.project.generatedContent}
                    </div>
                  </div>

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
                      Create Another
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

export default ContentDraftScreen;
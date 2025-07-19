import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Badge, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import Message from '../components/Message';

const ImagePromptScreen = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: 'Germany',
    language: 'English',
    tone: 'professional',
    category: 'Technology',
    baseContent: '',
    visualStyle: 'minimalistic, high-contrast background'
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

  const visualStyles = [
    'minimalistic, high-contrast background',
    'luxury, gold accents, premium feel',
    'modern, clean, corporate style',
    'vibrant, colorful, energetic',
    'soft, pastel, friendly atmosphere',
    'dark, moody, dramatic lighting',
    'bright, airy, lifestyle photography',
    'flat lay, organized, professional'
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
    
    if (!formData.title || !formData.baseContent) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/content/image-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate image prompt';
        
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
      baseContent: "Introducing our latest premium wireless headphones with advanced noise cancellation technology. Experience crystal-clear audio quality and all-day comfort with our revolutionary design that combines style and performance."
    }));
  };

  return (
    <>
      <Meta title="Image Prompt Generation - AI Content Creator" />
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <Card>
              <Card.Header>
                <h2 className="mb-0">🎨 Image Prompt Generation</h2>
                <small className="text-muted">
                  Generate detailed prompts for AI image generation tools
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
                          placeholder="e.g., Headphones Product Visual"
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
                        <Form.Label>Brand Tone *</Form.Label>
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
                        <Form.Label>Visual Style Preference</Form.Label>
                        <Form.Select
                          name="visualStyle"
                          value={formData.visualStyle}
                          onChange={handleInputChange}
                        >
                          {visualStyles.map((style, index) => (
                            <option key={index} value={style}>
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label>Base Content for Visual *</Form.Label>
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
                      name="baseContent"
                      value={formData.baseContent}
                      onChange={handleInputChange}
                      placeholder="Provide the content or description that the image should visually represent..."
                      required
                    />
                    <Form.Text className="text-muted">
                      This content will be used to create a detailed image generation prompt
                    </Form.Text>
                  </Form.Group>

                  <Card className="bg-light mb-4">
                    <Card.Body>
                      <h6>💡 Pro Tips for Better Image Prompts:</h6>
                      <ul className="mb-0 small">
                        <li>Be specific about your product features and benefits</li>
                        <li>Include context about target audience and use cases</li>
                        <li>Mention any specific visual elements you want highlighted</li>
                        <li>Consider the marketing channel where the image will be used</li>
                      </ul>
                    </Card.Body>
                  </Card>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      variant="warning" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Generating Image Prompt...
                        </>
                      ) : (
                        'Generate Image Prompt'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {result && (
              <Card className="mt-4">
                <Card.Header>
                  <h4 className="mb-0">Generated Image Prompt</h4>
                  <small className="text-muted">
                    Project: {result.project?.title || 'Image Prompt'}
                  </small>
                </Card.Header>
                <Card.Body>
                  {result.trendingKeywords && result.trendingKeywords.length > 0 && (
                    <div className="mb-3">
                      <h6>Trending Elements Included:</h6>
                      {result.trendingKeywords.map((keyword, index) => (
                        <Badge key={index} bg="info" className="me-2">
                          {keyword.keyword} ({keyword.interest}%)
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <h6>Base Content:</h6>
                    <div 
                      className="p-3 bg-light border rounded"
                      style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                    >
                      {result.baseContent}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h6>AI Image Generation Prompt:</h6>
                    <div 
                      className="p-3 bg-warning bg-opacity-10 border border-warning rounded"
                      style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                    >
                      {result.imagePrompt}
                    </div>
                  </div>

                  <Card className="mt-3 bg-light">
                    <Card.Body>
                      <h6>How to Use This Prompt:</h6>
                      <ol className="mb-0 small">
                        <li>Copy the generated prompt above</li>
                        <li>Paste it into your preferred AI image generator (DALL-E, Midjourney, Stable Diffusion, etc.)</li>
                        <li>Adjust any specific technical parameters based on your platform</li>
                        <li>Generate multiple variations and select the best one</li>
                      </ol>
                    </Card.Body>
                  </Card>

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
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigator.clipboard.writeText(result.imagePrompt)}
                      className="ms-2"
                    >
                      Copy Prompt
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

export default ImagePromptScreen;
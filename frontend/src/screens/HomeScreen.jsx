import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const HomeScreen = () => {
  return (
    <>
      <Meta title="AI Content Creator for E-commerce" />
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="text-center mb-5">
              <h1 className="display-4 mb-3">AI Content Creator</h1>
              <p className="lead text-muted">
                Generate high-quality, trend-driven content for your e-commerce business. 
                Create engaging content, modify existing text, and generate image prompts 
                powered by Google's Gemini AI and real-time trend data.
              </p>
            </div>
            
            <Row>
              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm border-primary">
                  <Card.Body className="text-center">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>✍️</div>
                    <Card.Title>Content Drafting</Card.Title>
                    <Card.Text>
                      Create new content from scratch using trending keywords 
                      and market insights for your target location and category.
                    </Card.Text>
                    <Button as={Link} to="/content/draft" variant="primary">
                      Start Drafting
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm border-success">
                  <Card.Body className="text-center">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🔄</div>
                    <Card.Title>Content Modification</Card.Title>
                    <Card.Text>
                      Transform your existing content - elaborate, summarize, 
                      or rephrase to match your desired tone and style.
                    </Card.Text>
                    <Button as={Link} to="/content/modify" variant="success">
                      Modify Content
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm border-warning">
                  <Card.Body className="text-center">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🎨</div>
                    <Card.Title>Image Prompts</Card.Title>
                    <Card.Text>
                      Generate detailed prompts for AI image generation tools 
                      that perfectly align with your content and brand voice.
                    </Card.Text>
                    <Button as={Link} to="/content/image-prompt" variant="warning">
                      Create Prompts
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Row className="mt-4 justify-content-center">
              <Col md={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="text-center">
                    <Card.Title>📊 My Projects</Card.Title>
                    <Card.Text>
                      View and manage all your content creation projects 
                      in one convenient dashboard.
                    </Card.Text>
                    <Button as={Link} to="/projects" variant="outline-primary">
                      View Projects
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <div className="text-center mt-5">
              <h3>Why Choose Our AI Content Creator?</h3>
              <Row className="mt-4">
                <Col md={3}>
                  <div className="mb-3">
                    <h5>📈 Trend-Driven</h5>
                    <p className="text-muted">Content based on real-time Google Trends data</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <h5>🌍 Global Reach</h5>
                    <p className="text-muted">Support for multiple countries and languages</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <h5>🎯 Category Specific</h5>
                    <p className="text-muted">Tailored for various e-commerce categories</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <h5>⚡ AI-Powered</h5>
                    <p className="text-muted">Powered by Google's advanced Gemini AI</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const ProjectDetailScreen = () => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchProject();
    }
  }, [userInfo, navigate, id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/content/projects/${id}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch project');
      }

      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getProjectTypeIcon = (type) => {
    switch (type) {
      case 'content-drafting': return '✍️';
      case 'content-modification': return '🔄';
      case 'image-prompt': return '🎨';
      default: return '📄';
    }
  };

  const getProjectTypeLabel = (type) => {
    switch (type) {
      case 'content-drafting': return 'Content Drafting';
      case 'content-modification': return 'Content Modification';
      case 'image-prompt': return 'Image Prompt Generation';
      default: return 'Unknown';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <Badge bg="success">Completed</Badge>;
      case 'generating': return <Badge bg="warning">Generating</Badge>;
      case 'failed': return <Badge bg="danger">Failed</Badge>;
      case 'draft': return <Badge bg="secondary">Draft</Badge>;
      default: return <Badge bg="light">{status}</Badge>;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Container>
        <Message variant="danger">{error}</Message>
        <Button as={Link} to="/projects" variant="primary">
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Meta title={project?.title || 'Project Details'} />
      <Container>
        <Row>
          <Col md={10} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2>
                  {getProjectTypeIcon(project.projectType)} {project.title}
                </h2>
                <div className="text-muted">
                  <small>
                    {getProjectTypeLabel(project.projectType)} • Created: {formatDate(project.createdAt)}
                    {project.updatedAt !== project.createdAt && (
                      <> • Updated: {formatDate(project.updatedAt)}</>
                    )}
                  </small>
                </div>
              </div>
              <div>
                {getStatusBadge(project.status)}
                <Button as={Link} to="/projects" variant="outline-secondary" className="ms-2">
                  Back to Projects
                </Button>
              </div>
            </div>

            {/* Project Configuration */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Project Configuration</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped>
                  <tbody>
                    <tr>
                      <td><strong>Project Type</strong></td>
                      <td>{getProjectTypeLabel(project.projectType)}</td>
                    </tr>
                    <tr>
                      <td><strong>Target Location</strong></td>
                      <td>{project.location}</td>
                    </tr>
                    <tr>
                      <td><strong>Language</strong></td>
                      <td>{project.language}</td>
                    </tr>
                    <tr>
                      <td><strong>Tone</strong></td>
                      <td className="text-capitalize">{project.tone}</td>
                    </tr>
                    <tr>
                      <td><strong>Category</strong></td>
                      <td className="text-capitalize">{project.category.replace('-', ' ')}</td>
                    </tr>
                    {project.contentIntent && (
                      <tr>
                        <td><strong>Content Intent</strong></td>
                        <td>{project.contentIntent}</td>
                      </tr>
                    )}
                    {project.desiredLength && (
                      <tr>
                        <td><strong>Desired Length</strong></td>
                        <td>{project.desiredLength}</td>
                      </tr>
                    )}
                    {project.modificationType && (
                      <tr>
                        <td><strong>Modification Type</strong></td>
                        <td className="text-capitalize">{project.modificationType}</td>
                      </tr>
                    )}
                    {project.visualStyle && (
                      <tr>
                        <td><strong>Visual Style</strong></td>
                        <td>{project.visualStyle}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Trending Keywords */}
            {project.trendingKeywords && project.trendingKeywords.length > 0 && (
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">📈 Trending Keywords Used</h5>
                </Card.Header>
                <Card.Body>
                  {project.trendingKeywords.map((keyword, index) => (
                    <Badge key={index} bg="info" className="me-2 mb-2">
                      {keyword.keyword} ({keyword.interest}% interest)
                    </Badge>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Original Content (for modification and image prompt projects) */}
            {project.originalContent && (
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    {project.projectType === 'content-modification' ? '📝 Original Content' : '📄 Base Content'}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div 
                    className="p-3 bg-light border rounded"
                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                  >
                    {project.originalContent}
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => copyToClipboard(project.originalContent)}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Generated Content */}
            {project.generatedContent && (
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    {project.projectType === 'content-drafting' && '✨ Generated Content'}
                    {project.projectType === 'content-modification' && '🔄 Modified Content'}
                    {project.projectType === 'image-prompt' && '🎨 Generated Image Prompt'}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div 
                    className={`p-3 border rounded ${
                      project.projectType === 'content-drafting' ? 'bg-primary bg-opacity-10 border-primary' :
                      project.projectType === 'content-modification' ? 'bg-success bg-opacity-10 border-success' :
                      'bg-warning bg-opacity-10 border-warning'
                    }`}
                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                  >
                    {project.generatedContent}
                  </div>
                  <div className="mt-3">
                    <Button 
                      variant="primary" 
                      onClick={() => copyToClipboard(project.generatedContent)}
                      className="me-2"
                    >
                      Copy to Clipboard
                    </Button>
                    {project.projectType === 'image-prompt' && (
                      <Button 
                        variant="outline-info"
                        href="https://openai.com/dall-e-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try in DALL-E
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <div className="d-grid">
                      <Button 
                        as={Link} 
                        to="/content/draft" 
                        variant="outline-primary"
                      >
                        ✍️ Create New Draft
                      </Button>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-grid">
                      <Button 
                        as={Link} 
                        to="/content/modify" 
                        variant="outline-success"
                      >
                        🔄 Modify Content
                      </Button>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-grid">
                      <Button 
                        as={Link} 
                        to="/content/image-prompt" 
                        variant="outline-warning"
                      >
                        🎨 Image Prompt
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProjectDetailScreen;
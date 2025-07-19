import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchProjects();
    }
  }, [userInfo, navigate]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/content/projects', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }

      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/content/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete project');
      }

      setProjects(projects.filter(project => project._id !== id));
    } catch (err) {
      setError(err.message);
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
      case 'image-prompt': return 'Image Prompt';
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

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.projectType === filter;
  });

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title="My Projects - AI Content Creator" />
      <Container>
        <Row>
          <Col md={10} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>📊 My Projects</h2>
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary">
                  Create New Project
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/content/draft">
                    ✍️ Content Drafting
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/content/modify">
                    🔄 Content Modification
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/content/image-prompt">
                    🎨 Image Prompt
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {error && <Message variant="danger">{error}</Message>}

            {/* Filter Buttons */}
            <div className="mb-4">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('all')}
                className="me-2"
              >
                All Projects ({projects.length})
              </Button>
              <Button
                variant={filter === 'content-drafting' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('content-drafting')}
                className="me-2"
              >
                ✍️ Drafting ({projects.filter(p => p.projectType === 'content-drafting').length})
              </Button>
              <Button
                variant={filter === 'content-modification' ? 'success' : 'outline-success'}
                onClick={() => setFilter('content-modification')}
                className="me-2"
              >
                🔄 Modification ({projects.filter(p => p.projectType === 'content-modification').length})
              </Button>
              <Button
                variant={filter === 'image-prompt' ? 'warning' : 'outline-warning'}
                onClick={() => setFilter('image-prompt')}
              >
                🎨 Image Prompts ({projects.filter(p => p.projectType === 'image-prompt').length})
              </Button>
            </div>

            {filteredProjects.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <h5 className="text-muted">No projects found</h5>
                  <p className="text-muted">
                    {filter === 'all' 
                      ? "You haven't created any projects yet. Start creating content!" 
                      : `No ${getProjectTypeLabel(filter).toLowerCase()} projects found.`
                    }
                  </p>
                  <Button as={Link} to="/content/draft" variant="primary">
                    Create Your First Project
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <ListGroup variant="flush">
                  {filteredProjects.map((project) => (
                    <ListGroup.Item key={project._id}>
                      <Row className="align-items-center">
                        <Col>
                          <div className="d-flex align-items-center mb-2">
                            <span className="me-2" style={{ fontSize: '1.5rem' }}>
                              {getProjectTypeIcon(project.projectType)}
                            </span>
                            <div>
                              <h6 className="mb-1">{project.title}</h6>
                              <small className="text-muted">
                                {getProjectTypeLabel(project.projectType)} • {project.location} • {project.category}
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            {getStatusBadge(project.status)}
                            <small className="text-muted ms-3">
                              Created: {formatDate(project.createdAt)}
                              {project.updatedAt !== project.createdAt && (
                                <> • Updated: {formatDate(project.updatedAt)}</>
                              )}
                            </small>
                          </div>
                        </Col>
                        <Col xs="auto">
                          <Button
                            as={Link}
                            to={`/project/${project._id}`}
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteProject(project._id)}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            )}

            <div className="mt-4 text-center">
              <Card className="bg-light">
                <Card.Body>
                  <h6>📈 Quick Stats</h6>
                  <Row>
                    <Col md={3}>
                      <div>
                        <strong>{projects.length}</strong>
                        <br />
                        <small className="text-muted">Total Projects</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div>
                        <strong>{projects.filter(p => p.status === 'completed').length}</strong>
                        <br />
                        <small className="text-muted">Completed</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div>
                        <strong>{projects.filter(p => p.projectType === 'content-drafting').length}</strong>
                        <br />
                        <small className="text-muted">Drafts Created</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div>
                        <strong>{projects.filter(p => p.projectType === 'image-prompt').length}</strong>
                        <br />
                        <small className="text-muted">Image Prompts</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProjectsScreen;
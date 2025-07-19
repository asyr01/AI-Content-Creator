import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const ConversationsScreen = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchConversations();
    }
  }, [userInfo, navigate]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/gemini/conversations', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch conversations');
      }

      setConversations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gemini/conversations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete conversation');
      }

      setConversations(conversations.filter(conv => conv._id !== id));
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

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title="My Conversations" />
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>My Conversations</h2>
              <Button as={Link} to="/chat" variant="primary">
                New Chat
              </Button>
            </div>

            {error && <Message variant="danger">{error}</Message>}

            {conversations.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <h5 className="text-muted">No conversations yet</h5>
                  <p className="text-muted">Start your first conversation with Gemini AI!</p>
                  <Button as={Link} to="/chat" variant="primary">
                    Start Chatting
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <ListGroup variant="flush">
                  {conversations.map((conversation) => (
                    <ListGroup.Item key={conversation._id}>
                      <Row className="align-items-center">
                        <Col>
                          <h6 className="mb-1">{conversation.title}</h6>
                          <small className="text-muted">
                            Created: {formatDate(conversation.createdAt)}
                            {conversation.updatedAt !== conversation.createdAt && (
                              <> • Updated: {formatDate(conversation.updatedAt)}</>
                            )}
                          </small>
                          <br />
                          <small className="badge bg-secondary">
                            {conversation.model}
                          </small>
                        </Col>
                        <Col xs="auto">
                          <Button
                            as={Link}
                            to={`/conversation/${conversation._id}`}
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteConversation(conversation._id)}
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ConversationsScreen;
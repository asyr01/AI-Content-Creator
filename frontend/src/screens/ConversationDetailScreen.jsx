import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const ConversationDetailScreen = () => {
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchConversation();
    }
  }, [userInfo, navigate, id]);

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/gemini/conversations/${id}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch conversation');
      }

      setConversation(data);
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

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Container>
        <Message variant="danger">{error}</Message>
        <Button as={Link} to="/conversations" variant="primary">
          Back to Conversations
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Meta title={conversation?.title || 'Conversation'} />
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2>{conversation.title}</h2>
                <div className="text-muted">
                  <small>
                    Created: {formatDate(conversation.createdAt)}
                    {conversation.updatedAt !== conversation.createdAt && (
                      <> • Updated: {formatDate(conversation.updatedAt)}</>
                    )}
                  </small>
                  <Badge bg="secondary" className="ms-2">
                    {conversation.model}
                  </Badge>
                </div>
              </div>
              <Button as={Link} to="/conversations" variant="outline-secondary">
                Back to Conversations
              </Button>
            </div>

            <Card>
              <Card.Body>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {conversation.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-3 d-flex ${
                        message.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-light border'
                        }`}
                        style={{ maxWidth: '70%' }}
                      >
                        <div className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </div>
                        <small className={message.role === 'user' ? 'text-light' : 'text-muted'}>
                          {formatDate(message.timestamp)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <div className="mt-3 text-center">
              <Button as={Link} to="/chat" variant="primary">
                Continue in New Chat
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ConversationDetailScreen;
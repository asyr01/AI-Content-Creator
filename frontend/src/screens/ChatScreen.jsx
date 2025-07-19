import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: message,
          conversationId: conversationId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, assistantMessage]);
      
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setConversation([]);
    setConversationId(null);
    setError('');
  };

  return (
    <>
      <Meta title="AI Chat" />
      <Container fluid>
        <Row>
          <Col md={8} className="mx-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Chat with Gemini AI</h2>
              <Button variant="outline-secondary" onClick={startNewConversation}>
                New Chat
              </Button>
            </div>

            {error && <Message variant="danger">{error}</Message>}

            <Card style={{ height: '60vh' }}>
              <Card.Body className="d-flex flex-column">
                <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '100%' }}>
                  {conversation.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                      <h5>Start a conversation!</h5>
                      <p>Ask me anything. I'm here to help.</p>
                    </div>
                  ) : (
                    conversation.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-3 d-flex ${
                          msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded ${
                            msg.role === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-light border'
                          }`}
                          style={{ maxWidth: '70%' }}
                        >
                          <div className="mb-1">{msg.content}</div>
                          <small className={msg.role === 'user' ? 'text-light' : 'text-muted'}>
                            {msg.timestamp.toLocaleTimeString()}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="d-flex justify-content-start mb-3">
                      <div className="p-3 bg-light border rounded">
                        <Loader />
                        <small className="text-muted">Gemini is thinking...</small>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <Form onSubmit={sendMessage}>
                  <Row>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                      />
                    </Col>
                    <Col xs="auto">
                      <Button type="submit" disabled={isLoading || !message.trim()}>
                        Send
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatScreen;
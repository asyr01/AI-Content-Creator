import { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Meta from '../../components/Meta';

const UserEditScreen = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    isAdmin: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      fetchUser();
    }
  }, [userInfo, navigate, id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      setUser({
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      navigate('/admin/userlist');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title="Edit User - Admin Panel" />
      <Container>
        <Button as={Link} to="/admin/userlist" variant="outline-secondary" className="mb-3">
          ← Back to Users
        </Button>
        
        <Card>
          <Card.Header>
            <h3>Edit User</h3>
          </Card.Header>
          <Card.Body>
            {error && <Message variant="danger">{error}</Message>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={user.isAdmin}
                  onChange={(e) => setUser({...user, isAdmin: e.target.checked})}
                />
              </Form.Group>
              
              <Button 
                type="submit" 
                variant="primary"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update User'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default UserEditScreen;
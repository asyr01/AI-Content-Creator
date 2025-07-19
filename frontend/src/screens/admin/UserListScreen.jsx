import { useEffect, useState } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Meta from '../../components/Meta';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [userInfo, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title="Users - Admin Panel" />
      <Container>
        <h2>User Management</h2>
        
        {error && <Message variant="danger">{error}</Message>}
        
        <Card>
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Projects</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.isAdmin ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-danger">✗</span>
                      )}
                    </td>
                    <td>{user.stats?.totalProjects || 0}</td>
                    <td>
                      {user.stats?.lastActiveAt 
                        ? new Date(user.stats.lastActiveAt).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td>
                      <Button
                        as={Link}
                        to={`/admin/user/${user._id}/edit`}
                        variant="outline-primary"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default UserListScreen;
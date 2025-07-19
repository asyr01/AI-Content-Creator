import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { useProfileMutation, useGetUserProfileQuery } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferences, setPreferences] = useState({
    defaultLocation: 'United States',
    defaultLanguage: 'English',
    defaultTone: 'professional',
    defaultCategory: 'Technology'
  });

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: currentUserData, isLoading: loadingProfile, refetch } = useGetUserProfileQuery();

  useEffect(() => {
    const userData = currentUserData || userInfo;
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
      if (userData.preferences) {
        setPreferences(userData.preferences);
      }
    }
  }, [currentUserData, userInfo]);

  // Refresh user data when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
          preferences
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
        refetch(); // Refresh user data after update
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

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

  return (
    <>
      <Meta title="My Profile" />
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>
              <h4>Account Information</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='email'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='confirmPassword'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' disabled={loadingUpdateProfile}>
                  Update Profile
                </Button>
                {loadingUpdateProfile && <Loader />}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={5}>
          <Card>
            <Card.Header>
              <h4>Content Creation Preferences</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className='my-2'>
                  <Form.Label>Default Location</Form.Label>
                  <Form.Select
                    value={preferences.defaultLocation}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      defaultLocation: e.target.value
                    })}
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className='my-2'>
                  <Form.Label>Default Language</Form.Label>
                  <Form.Select
                    value={preferences.defaultLanguage}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      defaultLanguage: e.target.value
                    })}
                  >
                    {languages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className='my-2'>
                  <Form.Label>Default Tone</Form.Label>
                  <Form.Select
                    value={preferences.defaultTone}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      defaultTone: e.target.value
                    })}
                  >
                    {tones.map(tone => (
                      <option key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className='my-2'>
                  <Form.Label>Default Category</Form.Label>
                  <Form.Select
                    value={preferences.defaultCategory}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      defaultCategory: e.target.value
                    })}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">My Statistics</h4>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => refetch()}
                disabled={loadingProfile}
              >
                {loadingProfile ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Card.Header>
            <Card.Body>
              {loadingProfile ? (
                <Loader />
              ) : (
                <Table striped>
                  <tbody>
                    <tr>
                      <td><strong>Total Projects</strong></td>
                      <td>{(currentUserData || userInfo).stats?.totalProjects || 0}</td>
                    </tr>
                    <tr>
                      <td><strong>Content Drafts</strong></td>
                      <td>{(currentUserData || userInfo).stats?.contentDrafts || 0}</td>
                    </tr>
                    <tr>
                      <td><strong>Content Modifications</strong></td>
                      <td>{(currentUserData || userInfo).stats?.contentModifications || 0}</td>
                    </tr>
                    <tr>
                      <td><strong>Image Prompts</strong></td>
                      <td>{(currentUserData || userInfo).stats?.imagePrompts || 0}</td>
                    </tr>
                    <tr>
                      <td><strong>Member Since</strong></td>
                      <td>
                        {(currentUserData || userInfo).createdAt 
                          ? new Date((currentUserData || userInfo).createdAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Last Active</strong></td>
                      <td>
                        {(currentUserData || userInfo).stats?.lastActiveAt 
                          ? new Date((currentUserData || userInfo).stats.lastActiveAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <div className="alert alert-info mb-3">
              <small><strong>Disclaimer:</strong> Generated results are suggestions only and should be reviewed before public use.</small>
            </div>
            <p>AI Content Creator &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;

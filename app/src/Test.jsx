import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { readById } from './testService';

export default ({ testId }) => {
  const [id, setId] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    readById(testId)
      .then(({ id, status }) => {
        setId(id);
        setStatus(status);
      })
      .catch(error => alert(error.message));
  }, []);

  return <Container>
    {status === 'WAITING' ? (
      <Row>
        <Col xs={12} style={{ textAlign: 'center' }}>
          <h1>Prisijungei prie testo Nr. {id}</h1>
        </Col>
        <Col xs={12} style={{ textAlign: 'center' }}>
          <h2>Testas tuojau prasidės</h2>
        </Col>
      </Row>
    ) : status === 'IN_PROGRESS' ? (
      <div>Testo klausimai</div>
    ) : (
          <React.Fragment />
        )
    }
  </Container>
};

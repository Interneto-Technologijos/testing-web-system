import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { create } from './testService';

export default () => {
  const [id, setId] = useState('');
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    create()
      .then(({ id, timer, status }) => {
        setId(id);
        setTimer(timer);
        setStatus(status);
      })
      .catch(() => alert('Test creation error'));
  }, []);

  return <Container>
    <Row>
      <Col xs={12} style={{ textAlign: 'center' }}>
        <h1>Testas Nr. {id}</h1>
      </Col>
      <Col xs={12} style={{ textAlign: 'center' }}>
        <h2>{String(Math.floor(timer / 60)).padStart(2, '0') + ':' + String(timer % 60).padStart(2, '0')}</h2>
      </Col>
      <Col xs={12} style={{ textAlign: 'center' }}>
        <button variant="primary" disabled={status != 'WAITING'}>Pradėti</button>
      </Col>
    </Row>
  </Container>
};

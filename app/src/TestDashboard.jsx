import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import { create, start } from './testService';

export default () => {
  const [id, setId] = useState('');
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState(null);

  const startHandler = () => {
    start(id)
      .then(({ status, timer, startedTimestamp }) => {
        setStatus(status);
        const intervalId = setInterval(() => {
          const currentTimer = Math.round(timer - moment.duration(moment().diff(moment(startedTimestamp))).as('seconds'));
          if (currentTimer > 0) {
            setTimer(currentTimer);
          } else {
            setTimer(0);
            clearInterval(intervalId);
          }
        }, 1000);
      })
      .catch(() => alert('Test start error'));
  };

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
        <button variant="primary" disabled={status != 'WAITING'} onClick={startHandler}>Pradėti</button>
      </Col>
    </Row>
  </Container>
};

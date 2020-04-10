import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { readById } from './testService';
import { getTestStudentQuestions } from './testStudentQuestionService';
import { answer } from './testStudentQuestionAnswerService';

export default ({ testId }) => {
  const [id, setId] = useState('');
  const [status, setStatus] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [questions, setQuestions] = useState('');

  const getTestDetails = () => {
    return readById(testId)
      .then(({ id, status }) => {
        setId(id);
        setStatus(status);
        return { id, status };
      })
      .catch(error => alert(error.message));
  };

  const onStudentIdChanged = ({ target: { value } }) => {
    setStudentId(value);
  };

  const onStartClicked = () => {
    return getTestStudentQuestions(testId, studentId)
      .then(setQuestions)
      .catch(error => alert(error.message));
  };

  const onOptionClicked = (questionIndex, optionIndex) => {
    return answer(testId, studentId, questionIndex + 1, optionIndex)
      .then(() => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answerIndex = optionIndex;
        setQuestions(updatedQuestions);
      })
      .catch(error => alert(error.message));
  };

  useEffect(() => {
    getTestDetails();

    const intervalId = setInterval(() => {
      getTestDetails()
        .then(({ status }) => {
          console.log(status)
          if (status !== 'WAITING') {
            clearInterval(intervalId);
          }
        });
    }, 2000);
  }, []);

  const Questions = () => {
    if (!questions) {
      return <Row>
        <Col xs={12} md={4} style={{ textAlign: 'center' }}>
          Studento knygelės Nr.:
      </Col>
        <Col xs={12} md={4} style={{ textAlign: 'center' }}>
          <input onChange={onStudentIdChanged} value={studentId} autoFocus="true" />
        </Col>
        <Col xs={12} md={4} style={{ textAlign: 'center' }}>
          <button onClick={onStartClicked}>Pradėti</button>
        </Col>
      </Row>
    }
    return questions.map(({ id, question, options, answerIndex }, questionIndex) => <Row>
      <Col xs={12} style={{ textAlign: 'center' }}>
        {id}. {question}
      </Col>
      {options.map((option, optionIndex) => <Col xs={12} md={3} style={{ textAlign: 'center' }}>
        <button variant="primary" onClick={() => onOptionClicked(questionIndex, optionIndex)} disabled={answerIndex === optionIndex}>
          {option}
        </button>
      </Col>)}
    </Row>)
  }

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
      <React.Fragment>
        <Row>
          <Col xs={12} style={{ textAlign: 'center' }}>
            <h1>Testas Nr. {id}</h1>
          </Col>
        </Row>
        <Questions />
      </React.Fragment>
    ) : (
          <React.Fragment />
        )
    }
  </Container>
};

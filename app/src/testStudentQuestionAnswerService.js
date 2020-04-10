export const answer = (testId, studentId, questionId, answerIndex) => {
    return fetch(`/api/tests/${testId}/students/${studentId}/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answerIndex }),
    })
        .then(response => {
            if (response.status >= 400 && response.status < 500) {
                return response.json().then(error => {
                    throw Error(error.message);
                });
            }
            if (response.status != 200) {
                throw Error();
            }
            return response.json();
        });
};
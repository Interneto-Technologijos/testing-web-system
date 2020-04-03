export const getTestStudentQuestions = (testId, studentId) => {
    return fetch(`/api/tests/${testId}/students/${studentId}/questions`)
        .then(response => {
            if (response.status != 200) {
                throw Error();
            }
            return response.json();
        });
};
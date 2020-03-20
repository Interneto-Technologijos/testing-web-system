export const create = () => {
    return fetch('/api/tests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
        .then(response => {
            if (response.status != 200) {
                throw Error();
            }
            return response.json();
        });
};

export const start = id => {
    return fetch(`/api/tests/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
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

export const readById = id => {
    return fetch(`/api/tests/${id}`)
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
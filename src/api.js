const fetch = require('node-fetch');

async function get(path) {
    const res = await fetch(process.env.API_URL + path, {
        path,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.SECRET}`
        }
    });

    return await res.json();
}

async function post(path, body) {
    console.log('POST', path, body);
    const res = await fetch(process.env.API_URL + path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${process.env.SECRET}`,
            'Content-Type': 'application/json'
        }
    });

    return await res.json();
}

module.exports = { get, post };

const fetch = require('node-fetch');

async function get(path) {
    const res = await fetch(process.env.API_HOSTNAME + path, {
        path,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.SECRET}`
        }
    });

    return await res.json();
}

async function post(path, body) {
    const res = await fetch(process.env.API_HOSTNAME, {
        path,
        method: 'POST',
        body,
        headers: {
            'Authorization': `Bearer ${process.env.SECRET}`
        }
    });

    return await res.json();
}

module.exports = { get, post };

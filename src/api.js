const https = require('https');

function get(path) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: process.env.API_HOSTNAME,
            path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.SECRET}`
            }
        }, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(JSON.parse(data)));
        });

        req.end();
        req.on('error', e => reject(e));
    });
}

function post(path, body) {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(body);
        const req = https.request({
            hostname: process.env.API_HOSTNAME,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': content.length,
                'Authorization': `Bearer ${process.env.SECRET}`
            }
        }, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(JSON.parse(data)));
        });

        req.write(content);
        req.end();
        req.on('error', e => reject(e));
    });
}

module.exports = { get, post };

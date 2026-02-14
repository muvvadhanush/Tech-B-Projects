const http = require('http');

const data = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message to verify the contact form fix.',
    phone: '1234567890',
    qualification: 'B.Tech',
    college: 'Test College',
    techStack: 'Python'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseData);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();

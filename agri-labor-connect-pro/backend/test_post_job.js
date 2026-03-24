const http = require('http');

const run = async () => {
    // 1. Register User
    const regReq = http.request('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            const result = JSON.parse(data);
            if (!result.token && !result.message.includes('User already exists')) {
                console.log('Reg failed:', data); return;
            }
            // 2. Login User
            const loginReq = http.request('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, (loginRes) => {
                let logData = '';
                loginRes.on('data', c => logData += c);
                loginRes.on('end', () => {
                    const token = JSON.parse(logData).token;
                    // 3. Post Job
                    const jobPayload = { title: "Test Job", description: "", workType: "Harvesting", date: "2026-10-10", wage: "500", location: "Pune", numWorkersRequired: 1, isUrgent: false };
                    
                    const postReq = http.request('http://localhost:5000/api/jobs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
                    }, (postRes) => {
                        let postData = '';
                        postRes.on('data', c => postData += c);
                        postRes.on('end', () => console.log('POST JOB CODE:', postRes.statusCode, 'RESPONSE:', postData));
                    });
                    postReq.write(JSON.stringify(jobPayload));
                    postReq.end();
                });
            });
            loginReq.write(JSON.stringify({ email: 'test_script@farmer.com', password: 'password123' }));
            loginReq.end();
        });
    });
    regReq.write(JSON.stringify({ name: "Test Script", email: 'test_script@farmer.com', password: 'password123', role: 'Farmer', location: 'Pune' }));
    regReq.end();
};
run();

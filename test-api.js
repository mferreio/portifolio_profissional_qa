const fetch = require('node-fetch');

async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/portfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': 'mferreio.qa'
            },
            body: JSON.stringify({ test: "data" })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testApi();

const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// รับทุก Request ที่เข้ามา
app.all('*', async (req, res) => {
    const targetUrl = 'https://api.binance.com' + req.originalUrl;

    console.log(`Forwarding to: ${targetUrl}`);

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                'X-MBX-APIKEY': req.headers['x-mbx-apikey'] || '',
                'Content-Type': 'application/json'
            },
            data: req.method === 'GET' ? undefined : req.body,
            validateStatus: () => true // ไม่ให้ axios error ถ้า status ไม่ใช่ 200
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy running on port ${port}`);
});

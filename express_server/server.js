

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

app.use(cookieParser());


app.post('/server-point', async (req, res) => {
    const { query, variables } = req.body;

    try {
        const response = await axios.post('http://localhost:8000/graphql/', {
            query,
            variables,
        });

        if ( response && response.status === 200 ) {

            const { token, refreshToken, user} = response.data.data.googleAuth;

            res.cookie('JWT', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 60 * 1000 });
            res.cookie('JWT-refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 1000 });
            res.status(200).json({
                data: {
                    googleAuth: {
                        user: user,
                        token: "",
                        refreshToken:"",
                    },
                },
            });
        }
        else{
            res.status(401).json({message: 'Unauthorized request'});
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Authentication failed' });
    }
});

// Proxy all /graphql requests to the Django server
app.use('/server-point', createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathRewrite: {
        '^/server-point': '/graphql', // Translate /server-point to /graphql when forwarding to Django
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.cookies['JWT']) {
            proxyReq.setHeader('Authorization', `JWT ${req.cookies['JWT']}`);
        }
    }
}));

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});

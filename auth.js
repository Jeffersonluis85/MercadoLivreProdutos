const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

router.get('/login', (req, res) => {
  const authUrl = \`https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=\${CLIENT_ID}&redirect_uri=\${REDIRECT_URI}\`;
  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token, user_id } = response.data;
    res.redirect(\`/products?access_token=\${access_token}&user_id=\${user_id}\`);
  } catch (error) {
    console.error('Erro ao autenticar:', error.response?.data || error.message);
    res.status(500).send('Erro ao autenticar com o Mercado Livre.');
  }
});

module.exports = router;
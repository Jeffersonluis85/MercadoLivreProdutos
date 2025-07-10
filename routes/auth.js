const express = require('express');
const axios = require('axios');
const router = express.Router();

// Variáveis de ambiente (do .env ou Render)
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Rota de login: redireciona para autorização do Mercado Livre
router.get('/login', (req, res) => {
  const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

// Rota de callback: recebe o code e troca por um access_token
router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Troca o code por um access_token usando a API do ML
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

    // Extrai o token e o ID do usuário
    const { access_token, user_id } = response.data;

    // Redireciona para a rota de produtos com o token na URL
    res.redirect(`/products?access_token=${access_token}&user_id=${user_id}`);
  } catch (error) {
    // LOG DETALHADO PARA DEBUG
    console.error('Erro ao autenticar com o Mercado Livre:', error.response?.data || error.message);

    // Mensagem genérica no navegador
    res.status(500).send('Erro ao autenticar com o Mercado Livre.');
  }
});

module.exports = router;

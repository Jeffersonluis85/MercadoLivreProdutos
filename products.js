const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { access_token, user_id } = req.query;

  if (!access_token || !user_id) {
    return res.status(400).send('Token ou ID do usuário ausente.');
  }

  try {
    const response = await axios.get(\`https://api.mercadolibre.com/users/\${user_id}/items/search\`, {
      headers: {
        Authorization: \`Bearer \${access_token}\`
      }
    });

    const items = response.data.results;
    let html = '<h2>Produtos Ativos</h2><ul class="list-group">';

    for (let itemId of items) {
      const itemRes = await axios.get(\`https://api.mercadolibre.com/items/\${itemId}\`);
      const item = itemRes.data;
      html += \`<li class="list-group-item"><strong>\${item.title}</strong> - R$ \${item.price}</li>\`;
    }

    html += '</ul><a href="/" class="btn btn-secondary mt-3">Voltar</a>';
    res.send(html);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.response?.data || error.message);
    res.status(500).send('Erro ao buscar os produtos.');
  }
});

module.exports = router;
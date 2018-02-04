const express = require('express');
const router = express.Router();

router.get('/keyboard', (req, res) => {
    const menu = {
        type: 'buttons',
        buttons: ["비트코인", "트론"]
    };

    res.set({
        'content-type' : 'application/json'
    }).send(JSON.stringify(menu))
});

module.exports = router;
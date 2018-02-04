const express = require('express');
const router = express.Router();

const message = require('./message');

router.get('/keyboard', (req, res) => {
    res.set({
        'content-type' : 'application/json'
    }).send(JSON.stringify(message.buttonsType()))
});

router.post('/message', (req, res) => {
    const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };

    let result;
    switch  (_obj.content) {
        case message.buttons[0]:
            result = message.baseType(message.buttons[0]);
            break;
        case message.buttons[1]:
            result = message.baseType(message.buttons[1]);
            break;
        default:
            result = message.baseType('error');
            break;
    }

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(result));
});

module.exports = router;
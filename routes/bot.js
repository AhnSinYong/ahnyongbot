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
    let massage = {
        "message": {
            "text": '응답 메세지...'
        },
        "keyboard": {
            "type": "buttons",
            "buttons": [
                "메뉴1",
                "메뉴2",
                "메뉴3"
            ]
        }
    };
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(massage));
});

module.exports = router;
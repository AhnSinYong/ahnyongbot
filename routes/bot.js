const express = require('express');
const router = express.Router();

const axios = require('axios');
const commaNumber = require('comma-number');
const emoji = require('node-emoji');
const message = require('./message');

router.get('/keyboard', (req, res) => {
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(message.buttonsType()))
});

router.post('/message', (req, res) => {
    const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };

    let result;
    switch (_obj.content) {
        case message.buttons[0]:
            axios.all([
                axios.get('https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.KRW-BTC'),
                axios.get('https://api.bitfinex.com/v2/ticker/tBTCUSD')
            ]).then(axios.spread((upbitKRWRes, bitfinexUSDRes) => {
                let priceInfomation = `${emoji.get('frog')}업비트 BTC/KRW${emoji.get('frog')}
${emoji.get('moneybag')}${commaNumber(upbitKRWRes.data[0].tradePrice)}${emoji.get('moneybag')}
${emoji.get('frog')}비트파이넥스 BTC/USD${emoji.get('frog')}
${emoji.get('moneybag')}${commaNumber(bitfinexUSDRes.data[6])}${emoji.get('moneybag')}`;

                result = message.baseType(priceInfomation);
                res.set({
                    'content-type': 'application/json'
                }).send(JSON.stringify(result));
            }));
            break;
        case message.buttons[1]:
            axios.all([
                axios.get('https://api.binance.com/api/v3/ticker/price?symbol=TRXBTC'),
                axios.get('https://api.binance.com/api/v3/ticker/price?symbol=TRXETH'),
                axios.get('https://api.coinnest.co.kr/api/pub/ticker?coin=tron')
            ]).then(axios.spread((binanceBTCRes, binanceETHRes, coinnestKRWRes) => {
                let priceInfomation = `${emoji.get('frog')}바이낸스 TRX/BTC${emoji.get('frog')}
${emoji.get('moneybag')}${commaNumber(binanceBTCRes.data.price)}${emoji.get('moneybag')}
${emoji.get('frog')}바이낸스 TRX/ETH${emoji.get('frog')}
${emoji.get('moneybag')}${commaNumber(binanceETHRes.data.price)}${emoji.get('moneybag')}
${emoji.get('frog')}코인네스트 TRX/KRW${emoji.get('frog')}
${emoji.get('moneybag')}${commaNumber(coinnestKRWRes.data.last)}${emoji.get('moneybag')}`;

                result = message.baseType(priceInfomation);
                res.set({
                    'content-type': 'application/json'
                }).send(JSON.stringify(result));
            }));
            break;
        default:
            result = message.baseType('error');
            res.set({
                'content-type': 'application/json'
            }).send(JSON.stringify(result));
            break;
    }
});

module.exports = router;
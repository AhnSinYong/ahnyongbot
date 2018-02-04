const express = require('express');
const router = express.Router();

const axios = require('axios');
const commaNumber = require('comma-number');
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
                let priceInfomation = `==업비트 BTC/KRW==
                    [${commaNumber(upbitKRWRes.data[0].tradePrice)}] 원
                    ==비트파이넥스 BTC/USD==
                    [${commaNumber(bitfinexUSDRes.data[6])}] 달라`;

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
                let priceInfomation = `==바이낸스 TRX/BTC== 
                    [${commaNumber(binanceBTCRes.data.price)}] 사토시
                    ==바이낸스 TRX/ETH== 
                    [${commaNumber(binanceETHRes.data.price)}] 이더
                    ==코인네스트 TRX/KRW== 
                    [${commaNumber(coinnestKRWRes.data.last)}] 원`;

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
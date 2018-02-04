const express = require('express');
const router = express.Router();

const axios = require('axios');
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
                console.log(upbitKRWRes.data);
                console.log(bitfinexUSDRes.data);
                result = message.baseType("업비트 BTC/KRW는" + upbitKRWRes.data.tradePrice + "입니다.\n" +
                    "비트파이넥스 BTC/USD는" + bitfinexUSDRes.data[6] + "입니다.");
            }));
            break;
        case message.buttons[1]:
            axios.all([
                axios.get('https://api.binance.com/api/v3/ticker/price?symbol=TRXBTC'),
                axios.get('https://api.binance.com/api/v3/ticker/price?symbol=TRXETH'),
                axios.get('https://api.coinnest.co.kr/api/pub/ticker?coin=tron')
            ]).then(axios.spread((binanceBTCRes, binanceETHRes, coinnestKRWRes) => {
                console.log(binanceBTCRes.data);
                console.log(binanceETHRes.data);
                console.log(coinnestKRWRes.data);
                result = message.baseType("바이낸스 TRX/BTC는" + binanceBTCRes.data.price + "입니다.\n" +
                    "바이낸스 TRX/ETH는" + binanceETHRes.data.price + "입니다.\n" +
                    "코인네스트 TRX/KRW는" + coinnestKRWRes.data.last + "입니다.");
            }));
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
const { base64_enc, base64_dec } = require('./base64');

const encryption_str = 'gIT6XcxDJ7pZVn85F2Uv0MQPSEwWiLdBG4AhqOfN1=jHC9rzsaRl3bmoykKetuY';
const encryption_str2 = 'qFTbCnAzhVJjc7reYkEwudUx6Qg1D3Wmt=pLaMIfol24X8BKSHyGRv5OP9s0NiZ';

function encode(string) {
    return base64_enc(
        [...base64_enc(string)]
            .map(c => encryption_str2[encryption_str.indexof(c)])
            .join('')
    );
}

function decode(string) {
    return base64_dec(
        [...base64_dec(string)]
            .map(c => encryption_str[encryption_str2.indexof(c)])
            .join('')
    );
}

module.exports = { encode, decode };

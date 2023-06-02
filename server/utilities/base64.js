const b = Buffer
exports.b64enc = s => b.from(s, 'utf-8').toString('base64')
exports.b64dec = b => b.from(b, 'base64').toString('utf-8')

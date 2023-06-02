const { Schema, model } = require('mongoose')

const keySchema = new Schema({
    key: { type: String, default: "NO_KEY", required: true },
    usedBy: { type: String, default: "NO_HWID" }
}, { collection: 'api_keys' })

module.exports = model('Key', keySchema)

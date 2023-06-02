const { Schema, model } = require('mongoose')

const serverSchema = new Schema({
    buyer_role: { type: String, default: "NO_ID", required: true },
    manager_role: { type: String, default: "NO_ID", required: true },
    cooldown_amount: { type: String, default: "" }
}, { collection: 'server' })

module.exports = model('Server', serverSchema)

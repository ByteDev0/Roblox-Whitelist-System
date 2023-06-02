const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    discord_id: { type: String, default: "NO_ID", required: true },
    key: { type: String, default: "NO_KEY", required: true },
    hwid: { type: String, default: "NO_HWID" },
    timezone: { type: String, default: "NO_TIMEZONE" },
    blacklisted: { type: Boolean, default: false },
    blacklistedFor: { type: Number, default: 0 },
    violations: { type: Number, default: 0 },
    whitelisted: { type: Boolean, default: false },
    lastHWIDReset: { type: Number, default: 0 },
    beforeReset: { type: Number, default: 0 }
}, { collection: 'users' })

module.exports = model('User', userSchema)

const express = require('express')
const { getKey } = require('../functions/functions')
const Key = require('../models/Key')

const router = express.Router()

router.get('/authorize', async (req, res) => {
    const API_KEY = await getKey(req)
    if (!API_KEY || !(await Key.findOne({key: API_KEY}))) return res.status(404).json({success: false, message: `API key not found`})
    return res.status(200).json({success: true, message: `User authorized!`, key: API_KEY})
})

module.exports = router

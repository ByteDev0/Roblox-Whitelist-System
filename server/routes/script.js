const express = require('express'), { getHWID } = require('../functions/functions')
const router = express.Router()

router.get('/script', async (req, res) => {
    const HWID = await getHWID(req)
    if (!HWID) return res.status(404).send(JSON.stringify({ success: false, message: `HWID_NOT_FOUND` }))
    res.download('../client.lua')
})

module.exports = router

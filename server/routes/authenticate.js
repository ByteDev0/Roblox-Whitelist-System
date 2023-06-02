const express = require('express')
const { getKey, getHWID, getUserByKey, updateHWID, getUserByHWID, checkHWID, updateBlacklist, getToken, getEquation, getRandom } = require('../functions/functions')
const User = require('../models/User')
const { encode, decode } = require('../utilities/encode')

const router = express.Router()

const equate = (number) => Math.ceil((number = parseInt(number) + 26) * 2 + number + 8 + 26262 + ((number + 3) + number * 2))

router.get('/authenticate', async (req, res) => {
    try {
        const [temp_key, HWID, TOKEN, temp_eq, temp_rand] = await Promise.all([getKey(req), getHWID(req), getToken(req), getEquation(req, TOKEN), getRandom(req, decode(temp_key), TOKEN)])
        const [API_KEY, EQUATION, RANDOM] = [decode(temp_key), decode(temp_eq), decode(temp_rand)]

        if (!API_KEY || !(await User.findOne({ key: API_KEY }))) return res.status(404).send(encode(JSON.stringify({ success: false, message: 'API_KEY_NF' })))

        let user = await getUserByKey(API_KEY)
        if (!user) return res.status(404).send(encode(JSON.stringify({ success: false, message: 'NOT_WLED' })))

        if (!HWID) return res.status(404).send(encode(JSON.stringify({ success: false, message: 'UNSUPP_EXEC' })))
        if (!user.hwid || user.hwid === 'NO_HWID') await updateHWID(user, HWID)

        user = await getUserByHWID(HWID)
        if (user.blacklisted && user.blacklistedFor > 0) {
            if (new Date().getTime() > parseInt(user.blacklistedFor)) {
                await updateBlacklist(user, false, 0)
                return res.status(404).send(encode(JSON.stringify({ success: false, message: 'BAN_EXPIRED' })))
            }
            return res.status(404).send(encode(JSON.stringify({ success: false, message: 'USER_BLACKLISTED' })))
        }

        if (!(await checkHWID(user, HWID)) || parseInt(EQUATION) != parseInt(equate(RANDOM))) return res.status(404).send(encode(JSON.stringify({ success: false, message: 'SERVER_EQUATION' })))

        const verification = encode(`${API_KEY}||${TOKEN}||${API_KEY}${TOKEN}|${RANDOM}|${EQUATION}${RANDOM}`)
        return res.status(200).send(encode(JSON.stringify({ success: true, message: 'USER_AUTHORIZED', verification, token: TOKEN, equation: EQUATION, server_equation: equate(RANDOM) })))

    } catch (e) {
        console.error(e)
        return res.status(500).send(encode(JSON.stringify({ success: false, message: 'SMTH_WENT_WRONG' })))
    }
})

module.exports = router


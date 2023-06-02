const express = require('express'), { getKey, updateBlacklist, getUserByKey, getEquation, getRandom, getReason } = require('../functions/functions'), router = express.Router(), d2m = d => ((24 * 60 * 60) * d) * 1000, m2t = ms => (ms + new Date().getTime()), eq = n => Math.ceil(((n = parseInt(n) + 26) * 2) + (n + 8) + 26262 + (n + 3 + n * 2)), BAN_TIMES = { 'HookingType1': 5, 'HookingType2': 5, 'TamperingType1': 3, 'TamperingType2': 3, 'EqHookingType1': 2, 'HttpSpyType1': 1 };

router.get('/ban', async (req, res) => {
    const [API_KEY, REASON, EQUATION, RANDOM] = await Promise.all([getKey(req), getReason(req).then(decode), getEquation(req), getRandom(req)]), BAN_TIME_IN_MS = d2m(BAN_TIMES[REASON]), BAN_TIME_IN_RT = m2t(BAN_TIME_IN_MS);
    if (!API_KEY || parseInt(EQUATION) != parseInt(eq(RANDOM))) return res.status(404).send(JSON.stringify({ success: false, message: `NO_API_KEY` }))
    try {
        let user = await getUserByKey(API_KEY), cv = user.violations ? ++user.violations : 1, ubl = await updateBlacklist(user, true, (BAN_TIME_IN_RT * cv));
        if (!ubl) throw 'An unexpected error occured while attempting to ban the user.'
        await user.updateOne({ violations: cv });
    } catch(e) {
        console.log('Ban Attempt --> ' + e)
        return res.status(404).send(JSON.stringify({ success: false, message: `SMTH_WENT_WRONG` }))
    }
    return res.status(404).send(JSON.stringify({ success: true, message: `BLACKLISTED` }))
})

module.exports = router

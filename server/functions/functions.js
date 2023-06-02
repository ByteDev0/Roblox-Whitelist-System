const fingerprints = ['Syn-Fingerprint', 'Fingerprint', 'Krnl-Fingerprint', 'Flux-Fingerprint', 'SW-Fingerprint']
const { findOne } = require('../models/User')
const { encode } = require('../utilities/encode')

const getUser = field => async value => {
  try { return await findOne({ [field]: value }) } 
  catch { return false }
}

const getReqValue = prop => field => req => req[prop][field] || false
const updateField = (user, field, value) => user.updateOne({ [field]: value }).then(() => true).catch(() => false)

const getFromReqHeadersOrQuery = (header, query) => req => req.headers[header] || req.query[query] || false
const getFingerprint = req => fingerprints.find(fp => req.headers[fp.toLowerCase()]) || false

module.exports = {
  getKey: getFromReqHeadersOrQuery('authorization', 'c'),
  getHWID: getFingerprint,
  checkHWID: (user, hwid) => user.hwid === hwid,
  checkTimezone: (user, timezone) => user.timezone === timezone,
  getTimezone: getReqValue('query')('timezone'),
  getUserByHWID: getUser('hwid'),
  getUserByKey: getUser('key'),
  getUserByTimezone: getUser('timezone'),
  updateHWID: (user, hwid) => updateField(user, 'hwid', hwid),
  updateTimezone: (user, timezone) => updateField(user, 'timezone', timezone),
  getToken: getReqValue('query')('b'),
  getRandom: (req, api_key, token) => getReqValue('query')(encode(api_key + token))(req),
  getEquation: (req, token) => getReqValue('query')(encode(token))(req),
  getReason: getReqValue('query')('reason'),
  updateBlacklist: async (user, bool, time_for) => 
    Promise.all([updateField(user, 'blacklisted', bool), updateField(user, 'blacklistedFor', time_for)]).then(() => true).catch(() => false)
}

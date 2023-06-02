const router = require('express').Router();

router.get('/status', (_, res) => res.json({ success: true, message: "API is up and running!" }));

module.exports = router;

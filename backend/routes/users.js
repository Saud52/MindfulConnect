const express = require('express');
const router = express.Router();
 

// Save privacy consent
router.post('/consent', (req, res) => {
  const { userId, consent } = req.body;

  if (!userId || consent === undefined) {
    return res.status(400).json({ msg: "Missing data" });
  }

  return res.json({
    msg: "Consent saved successfully",
    userId,
    consent
  });
});

module.exports = router;

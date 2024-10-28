const express = require('express');
const Authorization = require('../middleware/authentication');


const messageController = require('../controllers/message');

const router = express.Router();


router.post('/postmessage', Authorization.authenticate, messageController.saveMessage);
router.get('/getmessages', Authorization.authenticate, messageController.getMessages);

module.exports = router;
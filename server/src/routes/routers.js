const express = require('express');
const router = express.Router();

router.get('/dashboard');
router.get('/dashboard/search');
router.get('/dashboard/search/arts');
router.get('/dashboard/search/artist');
router.get('/settings', usersControllers.post);
router.get('/profile');
router.get('/messages');
router.get('/orders');
router.get('/review');
router.get('/review/new');
router.get('/transactionhistory');
router.get('/transactionhistory/details');

router.post('/settings');



module.exports = router;
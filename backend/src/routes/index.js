const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const bandRoutes = require('./band.routes');
const rehearsalRoutes = require('./rehearsal.routes');
const spaceRoutes = require('./space.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bands', bandRoutes);
router.use('/rehearsals', rehearsalRoutes);
router.use('/spaces', spaceRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Rehearsal Scheduler API' });
});

module.exports = router;
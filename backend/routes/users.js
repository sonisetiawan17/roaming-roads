const router = require('express').Router();
const User = require('../models/User');
const brycpt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    const saltRound = await brycpt.genSalt(10);
    const hashedPassword = await brycpt.hash(req.body.password, saltRound);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json('Wrong username or password');

    const validPassword = await brycpt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json('Wrong username or password');

    res.status(200).json({ _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

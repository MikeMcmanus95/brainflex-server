const router = require('express').Router();
const User = require('../db/models/user');

module.exports = router;

router.get('/me', (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.put('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) res.status(401).send('User not found.');
    else if (!user.hasMatchingPassword(req.body.password))
      res.status(401).send('Incorrect password.');
    else {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    req.login(user, err => {
      if (err) next(err);
      else res.json(user);
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', (req, res, next) => {
  try {
    req.logout();
    res.session.destroy();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

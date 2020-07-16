const router = require('express').Router();
const { Card } = require('../db/models');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const cards = await Card.findAll();
    res.send(cards);
  } catch (error) {
    next(error);
  }
});

router.get('/:cardId', async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByPk(cardId);
    res.send(card);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newCard = await Card.create(req.body);
    res.send(newCard);
  } catch (error) {
    next(error);
  }
});

router.put('/:cardId', async (req, res, next) => {
  try {
    const updatedCard = Card.update(req.body, {
      where: {
        id: req.params.cardId,
      },
    });
  } catch (error) {
    next(error);
  }
});

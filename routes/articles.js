const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticles,
  deleteArticle,
  createArticle,
} = require('../controllers/article');

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2),
    title: Joi.string().required().min(2),
    text: Joi.string().required().min(2),
    date: Joi.string().required().min(2),
    source: Joi.string().required().min(2),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }),
}), createArticle);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), deleteArticle);

module.exports = router;

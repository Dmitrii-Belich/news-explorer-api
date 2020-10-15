const Article = require('../models/article');
const CustomError = require('../utils/utils');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((Cards) => res.status(200).send(Cards.sort((a, b) => b.createdAt - a.createdAt)))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ keyword, title, text, date, source, link, image, owner: req.user._id })
    .then((card) => {
      Article.findById(card._id)
        .orFail(new CustomError(404, 'Данного id нет в базе'))
        .then((createdCard) => {
          res.status(200).send(createdCard);
        });
    }).catch((err) => next(new CustomError(400, err.message)));
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id).populate(['owner'])
    .orFail(new CustomError(404, 'Данного id нет в базе'))
    .then((card) => {
      console.log(card)
      if (card.owner._id.toString() === req.user._id.toString()) {
        Article.findOneAndDelete({ _id: card._id })
          .orFail(new CustomError(404, 'Данного id нет в базе'))
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          });
      } else {
        throw new CustomError(403, 'У вас нет прав на это действие');
      }
    }).catch(next);
};



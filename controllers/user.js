const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const CustomError = require('../utils/utils');

let JWT_SECRET;

if (process.env.NODE_ENV !== 'production') {
  JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'dev-key';
} else {
  JWT_SECRET = process.env.JWT_SECRET;
}

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new CustomError(404, 'Данный пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { password, email, name } = req.body;
  bcrypt.hash(password, 10).then((hashPassword) => {
    User.create({ password: hashPassword, email, name })
      .then((user) => res.status(200).send({ _id: user._id }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new CustomError(409, 'Пользователь с данным email уже зарегистрирован'));
        } else {
          next(new CustomError(400, err.message));
        }
      });
  });
};

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

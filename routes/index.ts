import express from 'express';
import app from '../app';

const router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export const routes = () => {
  app.use('/', router);
  app.use('/users', require('./users'));
};

export default routes;

const { Router } = require('express');

const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');

const AuthMiddleware = require('../app/middlewares/authMiddleware');

const router = Router();

router.post('/login', SessionController.store);

router.use(AuthMiddleware.protect);

router
  .route('/')
  .get(UserController.index)
  .post(UserController.store);

router
  .route('/:id')
  .get(UserController.show)
  .patch(UserController.update)
  .delete(UserController.delete);

module.exports = router;

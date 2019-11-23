const { Router } = require('express');

const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');
const MeController = require('../app/controllers/MeController');

const AuthMiddleware = require('../app/middlewares/authMiddleware');

const router = Router();

router.post('/login', SessionController.store);

router.post('/signup', MeController.store);

router.use(AuthMiddleware.protect);

router.get('/me', MeController.show, UserController.show);
router.patch('/me', MeController.update);

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

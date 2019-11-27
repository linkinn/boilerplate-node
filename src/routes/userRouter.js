const { Router } = require('express');

const multerConfig = require('../config/multer');

const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');
const MeController = require('../app/controllers/MeController');
const PasswordUpdateController = require('../app/controllers/PasswordUpdateController');

const AuthMiddleware = require('../app/middlewares/authMiddleware');
const resizeImages = require('../app/middlewares/resizeImages');

const router = Router();

router.post('/login', SessionController.store);

router.post('/signup', MeController.store);

router.use(AuthMiddleware.protect);

router.patch('/updateMyPassowrd', PasswordUpdateController.update);

router.get('/me', MeController.show, UserController.show);
router.patch(
  '/me',
  multerConfig.uploadPhotoUser,
  resizeImages.resizeUserPhoto,
  MeController.update
);

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

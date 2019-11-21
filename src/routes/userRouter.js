const { Router } = require('express');

const UserController = require('../app/controllers/UserController');

const router = Router();

router
  .route('/')
  .get(UserController.index)
  .post(UserController.store);

router.route('/:id').get(UserController.show);

module.exports = router;

const { Router } = require('express');
const userRouter = Router();
const userController = require('../controllers/userController');

userRouter.post('/register', userController.create);
userRouter.post("/login", userController.login);
userRouter.get('/:id', userController.show);
userRouter.patch('/:id', userController.update);
userRouter.delete('/:id', userController.destroy);



module.exports = userRouter;

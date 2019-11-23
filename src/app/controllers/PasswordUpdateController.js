// if (req.body.oldPassword && req.body.password && req.body.passwordConfirm) {
//   const user = await User.findById(req.user._id).select('+password');

//   if (!(await user.correctPassword('test1234', user.password))) {
//     throw Error('Password does not match');
//   }

//   filterBody.password = req.body.password;
//   filterBody.passwordConfirm = req.body.passwordConfirm;

//   const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
//     new: true,
//     runValidators: true,
//     context: 'query'
//   });

//   return res
//     .status(200)
//     .json({ status: 'success', data: { user: updateUser } });
// }

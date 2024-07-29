const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser, registerUser } = require('./user-controller');

// User routes
router.get('/users/get-all', getAllUsers);
router.get('/users/get/:id', getUserById);
router.post('/users/create', createUser);
router.put('/users/update/:id', updateUser);
router.delete('/users/delete/:id', deleteUser);
router.post('/users/login', loginUser);
router.post('/users/register', registerUser);

module.exports = router;
const User = require('./user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function getAllUsers(req, res) {
    const users = await User.find();
    res.json(users);
}

async function getUserById(req, res) {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
}

async function createUser(req, res) {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
        role
    });
    try {
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (req.body.username) {
            user.username = req.body.username;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.role) {
            user.role = req.body.role;
        }
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
}

async function registerUser(req, res) {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
    });
    try {
        await user.save();
        const token = jwt.sign({ id: user._id, role: 'user' }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    registerUser
};

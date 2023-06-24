const db = require('../db/index');
const { sequelize } = require('../db/database');

const User = db.user;

const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                password: req.body.password,
            },
        })
        if (user) {
            res.status(200).send({
                success: true,
                message: 'Login successful.',
            });
        } else {
            res.status(401).send({
                success: false,
                message: 'Wrong username or password.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while logging in.',
        });
    }
};

const signup = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            res.status(200).send({
                success: false,
                message: 'Username and password cannot be empty.',
            });
            return;
        }
        const existed = await User.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (existed) {
            res.status(200).send({
                success: false,
                message: 'Username already exists.',
            });
            return;
        }
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
        });
        if (user) {
            res.status(200).send({
                success: true,
                message: 'Signup successful.',
            });
        } else {
            res.status(500).send({
                success: false,
                message: 'Signup failed.',
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message || 'Some error occurred while signing up.',
        });
    }
}

module.exports = {
    login,
    signup,
};
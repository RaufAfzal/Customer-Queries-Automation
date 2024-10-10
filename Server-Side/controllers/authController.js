const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password:', password);

    const isProduction = process.env.NODE_ENV === 'production';

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ username }).exec();
    console.log("Found user:", foundUser);

    if (!foundUser || !foundUser.status) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    console.log("Password match:", match);

    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' } // Typically short-lived
    );

    const refreshToken = jwt.sign(
        {
            "username": foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Align with cookie maxAge
    );

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'Lax', // 'None' for cross-site in production, 'Lax' for development
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ accessToken });
});

const refresh = asyncHandler(async (req, res) => { // Make the function async
    const cookies = req.cookies;

    console.log('Refresh cookies:', cookies);

    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ message: "Forbidden" });
        }

        const foundUser = await User.findOne({ username: decoded.username }).exec();

        console.log('Refreshed user:', foundUser);

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Optionally, you can check if the user has been revoked or their roles have changed

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' } // Keep the same short-lived duration
        );

        res.json({ accessToken });
    });
});

const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No Content

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie Cleared' });
};

module.exports = {
    login,
    refresh,
    logout
};

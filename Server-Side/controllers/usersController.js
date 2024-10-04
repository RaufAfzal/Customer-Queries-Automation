const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').lean()

    if (!users?.length) {
        return res.status(400).json({ message: "No user found" })
    }
    res.json(users)

})

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fileds required' })
    }
    const duplicate = await User.findOne({ username: username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate found' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userObject = { username, "password": hashedPassword, roles }

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    }
    else {
        res.status(400).json({ message: 'Invalid Userdata created' })
    }

})

const updateUser = asyncHandler(async (req, res) => {
    const { _id, username, roles, status, password } = req.body;

    if (!_id || !username || !Array.isArray(roles) || !roles.length || typeof status !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    const user = await User.findById(_id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate && duplicate._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.roles = roles;
    user.status = status;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});



const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.body
    console.log(_id)

    if (!_id) {
        return res.status(400).json({ message: "User id required" })
    }

    const notes = await Note.findOne({ user: _id }).lean().exec()
    if (notes?.length) {
        return res.status(400).json({ message: "User has assigned notes" })
    }

    const user = await User.findById(_id).exec()

    if (!user) {
        res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username${result.username} with ID ${result._id} deleted`

    res.json(reply)

})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}
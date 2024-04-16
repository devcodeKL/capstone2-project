const bcrypt = require('bcrypt');
const User = require("../models/User");
const auth = require("../auth");
const jwt = require('jsonwebtoken');

const { sendRegistrationNotification, sendUpdatePasswordNotification } = require("../emailService");
const nodemailer = require("nodemailer");
require("dotenv").config();

// [REGISTER USER]
module.exports.registerUser = async (req, res) => {
     try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) { return res.status(400).send({ error: 'Email already exists!' });
        }
         if (!req.body.email.includes("@") || req.body.mobileNo.length !== 11 || req.body.password.length < 8) {
             return res.status(400).send({ error: 'Invalid Registration Data' });
         }

         const newUser = new User({
             firstName: req.body.firstName,
             lastName: req.body.lastName,
             email: req.body.email,
             mobileNo: req.body.mobileNo,
             password: bcrypt.hashSync(req.body.password, 10)
         });

         await newUser.save();
         await sendRegistrationNotification(req.body.email);

         res.status(201).send({ message: 'Registered Successfully' });
     } catch (error) {
         console.error('Error in registration:', error);
         res.status(500).send({ error: 'Error in registration', details: error.message });
     }
 };

// [LOGIN USER]
module.exports.loginUser = (req,res) => {
    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({ error: "No Email Found" });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({ access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send({ message: "Email and password do not match" });
                }
            }
        })
        .catch(err => {
                    console.error("Error in find: ", err)
                    return res.status(500).send({ error: "Error in find"})
                })
    } else {
        return res.status(400).send({error: "Invalid Email"})
    }   
};

// [GET PROFILE]
module.exports.getProfile = (req, res) => {
    const userId = req.user.id;
    return User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).send({ error: 'User not found' });
                }
                user.password = undefined;
                return res.status(200).send({ user });
            })
            .catch(err => {
                console.error("Error in fetching user profile", err)
                return res.status(500).send({ error: 'Failed to fetch user profile' })
            });
};

// [UPDATE AS ADMIN]
module.exports.updateAsAdmin = async (req, res) => {
    const { userId } = req.params;
    try {
        const isAdmin = req.user.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({ message: 'Access denied. Only admin users can perform this action.' });
        }
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }
        userToUpdate.isAdmin = true;
        await userToUpdate.save();
        res.status(200).json({ message: 'User updated as admin successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// [RESET PASSWORD]
module.exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id, email } = req.user;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        await sendUpdatePasswordNotification(email);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
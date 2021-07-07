const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');

//REGISTER
router.post('/register', async (req, res) => {
    //Validate data before creating new user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Check if user is already in database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');        

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });
    try {
        //save user to db
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        //Catch errors if any
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    //Validate data before creating new user
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Check if user exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found'); 

    //Confirm that password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    res.send('Logged in!');
});

module.exports = router;
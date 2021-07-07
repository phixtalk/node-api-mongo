const router = require('express').Router();
const User = require('../model/User');
const {registerValidation} = require('../validation');


router.post('/register', async (req, res) => {
    //Validate data before creating new user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //Check if user is already in database
    try {
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send('Email already exist');        
    } catch (error) {
        res.send(`${error}`)
    }

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
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

module.exports = router;
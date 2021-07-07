const jwt = require('jsonwebtoken');

//here we create a middleware to check if token is sent by the client
//and we add this to every route we wish to make private

module.exports = function (req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied!');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}






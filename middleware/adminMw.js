const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../config");

function auth(req, res, next) {
    const token = req.headers.token; 
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }
    try {
        const decoded = jwt.verify(token, JWT_ADMIN_SECRET); 
        req.adminId = decoded.id; 
        next(); 
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports={
    auth
}
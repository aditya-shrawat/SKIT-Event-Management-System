import {verifyToken}  from '../services/authentication.js';

export const checkTokenAuthentication = (req,res,next)=>{
    const token = req.cookies['token'] ;
    if(!token){
        console.error("Auth Error ")
        return res.status(401).json({error: "Unauthorized: No token provided"});
    }

    try {
        const payload = verifyToken(token) ;
        req.user = payload ;
        next();
    } catch (error) {
        return res.status(401).json({error: "Unauthorized: Invalid token"});
    }
}

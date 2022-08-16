/* ---------------------------------------------- *
 *   @ author  : Prashant Gaurav                  *
 *   @ version : 1.0                              *
/* ---------------------------------------------- */
const jwt = require('jsonwebtoken');
const apiConfig = require('../configuration');
const path = require('path');
const fs = require('fs');
const publicKey = fs.readFileSync(path.join(__dirname, '../configuration') + '/public.key', 'utf8');
module.exports = (req, res, next) => {
    const token = req.headers['token']
    if (token) {
        const verifyOptions = {
            issuer: apiConfig.JWT_ISS,
            subject: apiConfig.JWT_SUB,
            audience: apiConfig.JWT_AUD,
            maxAge: apiConfig.JWT_EXPIRE_IN,
            algorithm: apiConfig.JWT_ALGO
        }
        jwt.verify(token, publicKey, verifyOptions, (err, decoded) => {
            if (err) {
                const response = {
                    success: false,
                    status: 'unauthorised',
                    message: 'Session Expired, re-login please!'
                }
                return res.status(403).json(response);
            } else {
                req.decoded = decoded;
                const {userId, accessLevel} = decoded;
                if (accessLevel === 'super-admin' || accessLevel === 'admin') {
                    req.body.userId = userId / 512;
                    next();
                } else {
                    const response = {
                        success: false,
                        message: 'You dont have accesses for this action'
                    }
                    return res.status(403).json(response);
                }
            }
        });
    } else {
        const response = {
            success: false,
            status: 'unauthorised',
            message: 'Session Expired, re-login please!'
        }
        return res.status(401).json(response);
    }
};

const fs = require('fs');
const path = require('path');
const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const apiConfig = require('../../configuration');
const userPool = new Pool({connectionString: apiConfig.DB});
const privateKey = fs.readFileSync(path.join(__dirname, '../../configuration') + '/private.key', 'utf8');

router.post('/', async (req, res) => {
    
    const {loginId, loginPassword} = req.body;
    const sqlQuarry = {
        text: 'select admin_id as id, admin_name as name, admin_email as email, admin_contact as contact, role from admin where admin_login_id =$1 and admin_password =$2 and active = true',
        values: [loginId, loginPassword]
    };
    try {
        const result = await userPool.query(sqlQuarry);
        if (result.rows.length === 1) {
            const {id, name, email, contact, role} = result.rows[0];
            const signInOptions = {
                issuer: apiConfig.JWT_ISS,
                subject: apiConfig.JWT_SUB,
                audience: apiConfig.JWT_AUD,
                expiresIn: apiConfig.JWT_EXPIRE_IN,
                algorithm: apiConfig.JWT_ALGO
            }
            const payload = {
                userId: id * 512,
                accessLevel: role
            }
            const jwtToken = jwt.sign(payload, privateKey, signInOptions);
            return res.status(200).json({
                success: true,
                userData: {
                    userName: name,
                    userEmail: email,
                    userContact: contact,
                    userRole: role,
                    userToken: jwtToken
                }
            });
        }else{
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            success: false,
            message: 'Invalid credentials',
        });
    }
});
module.exports = router;

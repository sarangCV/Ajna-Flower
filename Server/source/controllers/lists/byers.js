const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const userPool = new Pool({connectionString: apiConfig.DB});

router.get('/', applyMiddleware, async (req, res) => {
    const sqlQuarry = {
        text: 'select client_id as id, client_name as name, upper(client_short_name) as sn from clients where active = $1',
        values: [true]
    };
    try {
        const result = await userPool.query(sqlQuarry);
        if (result) {
            return res.status(200).json({
                success: true,
                clientsList: result.rows
            });
        }
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});

router.post('/', applyMiddleware, async (req, res) => {
    const {clientName, clientShortName, clientEmail, clientNumber, gstNo, clientAddress, clientCountry, clientState, clientCity, clientZip} = req.body
    const sqlQuarry = {
        text: 'insert into clients (client_name, client_short_name,gst_no,client_email, client_whatsapp_no,  address, country, state, city, zipcode) values ($1, $2 , $3, $4, $5, $6, $7, $8, $9,$10)',
        values: [clientName, clientShortName, gstNo, clientEmail, clientNumber, clientAddress, clientCountry, clientState, clientCity, clientZip]
    };
    try {
        const result = await userPool.query(sqlQuarry);
        if (result) {
            return res.status(200).json({
                success: true,
                message: 'New Client added'
            });
        }
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});


router.get('/delete/:clientId', applyMiddleware, async (req, res) => {
    const {clientId} = req.params;
    const quarry = {
        text: 'update clients set active= false where client_id =$1',
        values: [clientId]
    }
    userPool.query(quarry).then(r => {
        res.status(200).json({
            success: true,
            message: 'Client disabled'
        });
    }).catch(e => {
        console.log(e)
        res.status(400).json({
            success: false,
            message: 'something went wrong.',
        });
    })
});


module.exports = router;

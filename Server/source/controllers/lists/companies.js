const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});

router.get('/', applyMiddleware, async (req, res) => {
    const sqlQuarry = {
        text: 'select company_id as id,upper(company_name) as name from companies where active= $1',
        values: [true]
    };
    try {
        const result = await dbPool.query(sqlQuarry);
        if (result) {
            return res.status(200).json({
                success: true,
                companiesList: result.rows
            });
        }
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});
module.exports = router;

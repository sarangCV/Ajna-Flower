const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});


/* ----------------------------------------------------- *
 *              GET EXPENSE ITEMS                     *
 * ----------------------------------------------------- */
router.get('/', applyMiddleware, async (req, res) => {

    const quarry={
        text:'select title, details, amount from expenses where active=$1',
        values: [true]
    }

    try {
        const result = await dbPool.query(quarry);
        if (result) {
            console.log(result.rows)
            return res.status(200).json({
                success: true,
                // message: result.rowCount === 0 ? 'There is no items left | items already assigned.' : 'Availabe items',
                expenses: result.rows
            });
        }
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            success: false,
            status: 'error',
            code: 'DI-E001',
            message: 'Something went wrong',
        });
    }

});


/* ----------------------------------------------------- *
 *              STORE EXPENSE DETAILS                    *
 * ----------------------------------------------------- */

router.post('/', applyMiddleware, async (req, res) => {
    const {title, details, amount} = req.body;

    const quarry={
        text:'insert into expenses(title, details, amount) values($1, $2, $3)',
        values: [title, details, amount]
    }

    dbPool.query(quarry).then(r => {
        res.status(200).json({
            success: true,
            message: 'Expenses accepted'
        });
    }).catch(e => {
        console.log(e)
        res.status(400).json({
            success: false,
            status: 'error',
            code: 'DTD-E001',
            message: 'Sorry, Expenses not accepted. Please try again.'
        });
    })
});
module.exports = router;

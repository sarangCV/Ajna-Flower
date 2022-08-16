const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});

router.post('/', applyMiddleware, async (req, res) => {
    const {boxName, boxQty, userId} = req.body
    const query = {
        text: 'insert into boxes (name, qty,added_by) values ($1, $2, $3)',
        values: [boxName, boxQty, userId]
    }
    try {
        const result = await dbPool.query(query);
        if (result) {
            return res.status(200).json({
                success: true,
                message: `${boxQty} new box added successfully`
            });
        }
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});

router.get('/status', applyMiddleware, async (req, res) => {
    const query1 = {
        text: 'select qty,created_at::timestamp::date as date,true as added from boxes where active= $1',
        values: [true]
    }
    const query2 = {
        text: 'select count(id) as qty ,created_at ::timestamp::date as date, false as added from dispatch_items  where active= $1 group by created_at',
        values: [true]
    }
    const client = await dbPool.connect()
    try {
        await client.query('BEGIN')
        const boxAdded = await client.query(query1);
        const boxDispatched = await client.query(query2);
        const newData = await (boxAdded.rows).concat(boxDispatched.rows)
        await client.query('COMMIT').then(() => {
            return res.status(200).json({
                success: true,
                data: newData
            })
        })
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK').then(() => {
            return res.status(400).json({
                success: false,
                status: 'error',
                code: 'P-E001',
                message: 'Oops something went wrong'
            })
        })
    } finally {
        client.release()
    }


});


module.exports = router;

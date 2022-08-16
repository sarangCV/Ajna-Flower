const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});

/* ----------------------------------------------------- *
 *           CALCULATE PRICE BASED ON BUNCH              *
 * ----------------------------------------------------- */
router.post('/calculator', applyMiddleware, async (req, res) => {
    const {itemId, price, transportCost, dispatchBoxId} = req.body;
    // console.log(req.body)
    // const query = {
    //     text: 'select item_qty as quantity from dispatch_items where id= $1 and active= $2',
    //     values: [itemId, true]
    // }
    // console.log(price)
    const quarry = {
        text: 'select item_qty as quantity from dispatch_box_items where id=$1 and active= $2',
        values: [dispatchBoxId, true]
    }
    try {
        const result = await dbPool.query(quarry);
        if (result) {
            const {rowCount, rows} = result;
            if (rowCount === 1) {
                const {quantity} = rows[0];
                return res.status(200).json({
                    success: true,
                    quantity: quantity,
                    total: (price * quantity) + parseInt(transportCost)  // NOTE: price is price of bunch
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'No data found',
                });
            }
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});

/* --------------------------------------------------------------- *
 *         STORE CALCULATED PRICE AND DETAILS FOR INVOICE          *
 * --------------------------------------------------------------- */

router.post('/store', applyMiddleware, async (req, res) => {
    const {userId, clientId, itemsPricing} = req.body;
    // console.log(itemsPricing)
    const client = await dbPool.connect()
    try {
        await client.query('BEGIN')
        const query = {
            text: 'insert into invoice (client_id, created_by) values ($1, $2) returning invoice_id',
            values: [clientId, userId]
        }
        console.log(query)
        const invoice = await client.query(query);
        const {invoice_id} = invoice.rows[0];
        const sqlData = itemsPricing.map(d => {
            return "(" + invoice_id + "," + d.itemId + "," + d.dispatchBoxId + "," + d.price + "," + d.transportCost + "," + d.total + ")"
        })
        const invoiceItems = `insert into  invoice_items(invoice_id, item_id, dispatch_box_item_id, price, transport, total)values ${sqlData}`
        await client.query(invoiceItems);
        await client.query('COMMIT').then(() => {
            return res.status(200).json({
                success: true,
                message: 'Items pricing accepted'
            })
        })
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK').then(() => {
            return res.status(400).json({
                success: false,
                status: 'error',
                code: 'P-E001',
                message: 'Sorry, pricing not accepted.|| Already assigned.'
            })
        })
    } finally {
        client.release()
    }
});
module.exports = router;


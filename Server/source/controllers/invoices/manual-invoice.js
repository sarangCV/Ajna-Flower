const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});

// GET MANUAL-INVOICES
router.get('/', applyMiddleware, async (req, res) => {

    const quarry = {
        // text: 'select * from manual_invoice_box_items where active= $1',
        // text: 'select company_name, company_address, company_contact, company_email, company_gst_no, client_name, client_address, client_contact, client_email, client_gst_no, invoice_number from manual_invoice where active= $1',
        // text: 'select manual_invoice.company_name, manual_invoice.company_address, manual_invoice.company_contact, manual_invoice.company_email, manual_invoice.company_gst_no from manual_invoice where active= $1 inner join manual_invoice_items on manual_invoice.invoice_id = manual_invoice_items.invoice_id',
        text: 'select manual_invoice.company_name, manual_invoice.company_address, manual_invoice.company_contact, manual_invoice.company_email, manual_invoice.company_gst_no, manual_invoice_items.box_no from manual_invoice inner join manual_invoice_items on manual_invoice.invoice_id = manual_invoice_items.invoice_id',
        // values: [true]
    }
    try {
        const result = await dbPool.query(quarry);
        if (result) {
            return res.status(200).json({
                success: true,
                data: result.rows
            });
        }
    } catch (e) {
        return res.status(404).json({
            success: false,
            status: 'error',
            code: 'DF-E001',
            message: 'Sorry, dispatches not available. Please try again.'
        });
    }
});


// STORE MANUAL-INVOICES
router.post('/', applyMiddleware, async (req, res) => {
    const {userId, company_name, company_address, company_contact, company_email, company_gst_no, company_dummy, client_name, client_address, client_contact, client_email, client_gst_no, client_dummy, invoice_number, dispatchItem } = req.body;
    
    const client = await dbPool.connect()
    try {
        await client.query('BEGIN')
        const query = {
            text:'insert into manual_invoice(company_name, company_address, company_contact, company_email, company_gst_no, company_dummy, client_name, client_address, client_contact, client_email, client_gst_no, client_dummy, invoice_number, created_by) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning invoice_id',
            values: [company_name, company_address, company_contact, company_email, company_gst_no, company_dummy, client_name, client_address, client_contact, client_email, client_gst_no, client_dummy, invoice_number, userId]
        }
        const invoice = await client.query(query);
        const {invoice_id} = invoice.rows[0];
        const query1 = 'insert into manual_invoice_items (invoice_id, box_no) values ($1, $2) returning invoice_item_id as box_id'
        const query2 = 'insert into manual_invoice_box_items (invoice_item_id, item_id, item_qty) values ($1, $2, $3)'
        const sqlData = dispatchItem.map(async d => {
            const {id, items} = d
            const invoiceItems = await client.query(query1, [invoice_id, id]);
            const {box_id} = invoiceItems.rows[0]
            const boxItms = await items.map(async bd => {
                const {id, qty} = bd
                await client.query(query2, [box_id, id, qty]);
            })
        })
        await client.query('COMMIT').then(() => {
            return res.status(200).json({
                success: true,
                // dispatchId: dispatch_id,
                message: 'Dispatches accepted'
            })
        })
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK').then(() => {
            return res.status(400).json({
                success: false,
                status: 'error',
                code: 'D-E001',
                message: 'Sorry, dispatches not accepted. Please try again.'
            })
        })
    console.log(invoice_id)

    } finally {
        client.release()
    }
});

module.exports = router;

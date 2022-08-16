const {Pool} = require('pg');
const fs = require('fs');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const invoice = require('easyinvoice');
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});
moment.locale('en-IN');


router.get('/', applyMiddleware, async (req, res) => {
    // const sqlQuarry = {
    //     text: 'select inv.invoice_id, inv.invoice_doc_path as download_url, inv.invoice_date, c.client_name from invoice as inv join clients c on c.client_id = inv.client_id where inv.active= $1',
    //     values: [true]
    // };

    const sqlQuarry = {
        text: 'select inv.invoice_id, inv.invoice_doc_path as download_url, case when inv.company_id is not null then (select company_name from companies where company_id=inv.company_id) else null end as company_name, inv.invoice_date, c.client_name from invoice as inv join clients c on c.client_id = inv.client_id where inv.active= $1 order by inv.invoice_id desc',
        values: [true]
    }

    try {
        const result = await dbPool.query(sqlQuarry);
        if (result) {
            // console.log(result.rows)
            return res.status(200).json({
                success: true,
                clientsList: result.rows
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

router.post('/', applyMiddleware, async (req, res) => {
    const {userId, invoiceId, companyId} = req.body;
    const client = await dbPool.connect()
    try {
        await client.query('BEGIN')
        const query = {
            text: 'update invoice set company_id= $1 where invoice.invoice_id= $2',
            values: [companyId, invoiceId]
        }
        await client.query(query);
        console.log('query')
        const query1 = {
            text: 'select i.invoice_id,i.invoice_date, i.company_id, c.company_name, c.company_logo,c.table_name, c.gst_no as company_gst, c.city as company_city, c.state as company_state, c.address as company_address, c.zipcode as company_zip, cl.client_name, cl.client_email, cl.city as client_city, cl.state as client_state, cl.country as client_country, cl.address as client_address, cl.zipcode as client_zip from invoice as i join companies c on c.company_id = i.company_id join clients cl on i.client_id = cl.client_id where i.invoice_id= $1 and i.active= $2',
            values: [invoiceId, true]
        }
        const companyDetails = await client.query(query1);

        console.log('quer1')
        const {company_name, company_logo, company_gst, table_name, company_city, company_state, company_address, company_zip, client_name, client_email, client_city, client_state, client_country, client_address, client_zip} = companyDetails.rows[0]
        // const query2 = {
        //     text: 'select (select category_name from categories where category_id= di.item_id) as description, di.item_qty as quantity, ii.tax, ii.total as price from invoice_items ii join dispatch_items di on di.id = ii.item_id where ii.invoice_id= $1 and ii.active= $2',
        //     values: [invoiceId, true]
        // }
        const query2={
            text:'select (select category_name from categories where category_id = dbi.item_id) as description, dbi.item_qty as quantity,ii.tax, ii.transport, ii.total as price from invoice_items ii join dispatch_items di on di.id = ii.item_id join dispatch_box_items dbi on di.id = dbi.dispatch_item_id where ii.invoice_id = $1 and ii.active = $2',
            values: [invoiceId, true]
        }
        const invoiceItems = await client.query(query2);
        console.log('query2')
        const query3 = `insert into ${table_name} (invoice_id, created_by) values (${invoiceId},${userId}) returning main_invoice_id,invoice_date as generated_at`
        const newInvoiceId = await client.query(query3);
        console.log('query3')
        const {main_invoice_id, generated_at} = newInvoiceId.rows[0]
        const invoiceData = {
            "documentTitle": "INVOICE", //Defaults to INVOICE
            "currency": "INR",
            "taxNotation": "gst", //or gst
            "marginTop": 40,
            "marginRight": 40,
            "marginLeft": 40,
            "marginBottom": 40,
            "logo": company_logo,
            "sender": {
                "company": company_name,
                "address": company_address,
                "zip": company_zip,
                "city": company_city,
                "country": "India",
                "custom1": 'GST NO: ' + company_gst
            },
            "client": {
                "company": client_name,
                "address": client_address,
                "zip": client_zip,
                "city": client_city,
                "country": client_country,
                "custom1": 'GST NO: ' + company_gst
            },
            "invoiceNumber": main_invoice_id,
            "invoiceDate": moment(generated_at).format('Do MMM YYYY'),
            "products": invoiceItems.rows,
            "bottomNotice": "This invoice is computer generated, any quarry pls write a mail on d@ajnasoft.com. Kindly pay your invoice within 15 days."
        };

        // console.log(invoiceData)
        const result = await invoice.createInvoice(invoiceData);
        const invoicesName = 'invoice' + '-' + company_name + '-' + main_invoice_id + '-' + moment(Date.now()).format('DMMYYYYhmmssms')
        await fs.writeFileSync(`./docs/invoices/${invoicesName}.pdf`, result.pdf, 'base64');
        const downloadPath = 'https://api.ajnasoft.com/docs/invoices/' + invoicesName + '.pdf'
        const storeInvoicesDocs1 = `update invoice set invoice_doc_path='${downloadPath}'where invoice_id= ${invoiceId}`
        const storeInvoicesDocs2 = `update ${table_name}  set invoice_doc='${downloadPath}'where main_invoice_id =${main_invoice_id}`
        await client.query(storeInvoicesDocs1);
        await client.query(storeInvoicesDocs2);
        await client.query('COMMIT').then(() => {
            return res.status(200).json({
                success: true,
                message: 'invoices generated, please download using link',
                downloadLink: downloadPath
            })
        })
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK').then(() => {
            return res.status(400).json({
                success: false,
                status: 'error',
                code: 'IVE-E001',
                message: 'Sorry, uanbale to generated invoices. Please try again.'
            })
        })
    } finally {
        client.release()
    }
});

module.exports = router;

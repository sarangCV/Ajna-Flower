const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});

router.post('/assign-item', applyMiddleware, async (req, res) => {
    const {userId, dispatchId, clientId, assignedItems} = req.body;
    // console.log(req.body)
    // console.log(dispatchId)
    const sqlData = assignedItems.map(d => {
        return "(" + d + "," + clientId + "," + userId + "," + dispatchId + ")"
    })

    // console.log(sqlData)
    const query1 = `insert into assigned_items(item_id, clients_id, assigned_by, dispatch_id) values ${sqlData}`
    // console.log(query1)
    const query2 = {
        text: 'update dispatches set assigned =true where dispatch_id =$1 and active =true',
        values: [dispatchId]
    }

    const client = await dbPool.connect()
    try {
        await client.query('BEGIN')
        await client.query(query1);
        await client.query(query2);
        await client.query('COMMIT').then(() => {
            return res.status(200).json({
                success: true,
                message: 'Items assigned  to clienst successfully'
            })
        })
    } catch (e) {
        console.log(e)
        await client.query('ROLLBACK').then(() => {
            return res.status(400).json({
                success: false,
                status: 'error',
                code: 'P-E001',
                message: 'Sorry, Items not assigned to clienst. Please try again.'
            })
        })
    } finally {
        client.release()
    }


    // try {
    //     const result = await userPool.query(query);
    //     if (result) {
    //         return res.status(200).json({
    //             success: true,
    //             message: 'item assigned successfully'
    //         });
    //     }
    // } catch (e) {
    //     return res.status(404).json({
    //         success: false,
    //         message: 'Something went wrong',
    //     });
    // }
});


router.post('/assigned-item', applyMiddleware, async (req, res) => {
    // console.log('hi')
    const {clientId, dispatchesId, assigningDate} = req.body;
    // console.log(clientId, dispatchesId, assigningDate)
    // const query = {
    //     text: 'select ai.id, ai.clients_id as client_id, ai.item_id, c.category_name from assigned_items ai join categories c on (select item_id from dispatch_items where id = ai.item_id) = c.category_id where ai.date = $1 and ai.clients_id= $2 and ai.active= $3',
    //     values: [assigningDate, clientId, true]
    // }

    // const query = {
    //     text: 'select ai.id, ai.clients_id as client_id, ai.item_id, c.category_name, case when ivi.item_id is not null then true else false end as assigned from assigned_items ai join categories c on (select item_id from dispatch_items where id = ai.item_id) = c.category_id left join invoice_items ivi on ivi.item_id = ai.item_id where ai.date = $1 and ai.clients_id= $2 and ai.active= $3',
    //     values: [assigningDate, clientId, true]
    // }

    // const query = {
    //     text: 'select ai.id, ai.clients_id as client_id, ai.item_id, c.category_name, case when ivi.item_id is not null then true else false end as assigned from assigned_items ai join categories c on (select item_id from dispatch_items where id = ai.item_id) = c.category_id left join invoice_items ivi on ivi.item_id = ai.item_id where ai.date = $1 and ai.clients_id= $2 and ai.active= $3',
    //     values: [assigningDate, clientId, true]
    // }

    const query = {
        text: 'select ai.id, ai.clients_id as client_id, ai.item_id, c.category_name, case when ivi.item_id is not null then true else false end as assigned from assigned_items ai join categories c on (select item_id from dispatch_items where id = ai.item_id) = c.category_id join dispatch_items di on di.dispatch_id = ai.item_id join dispatches d on d.dispatch_id = di.dispatch_id left join invoice_items ivi on ivi.item_id = ai.item_id where d.dispatch_at = $1 and ai.clients_id = $2 and ai.active = $3',
        values: [assigningDate, clientId, true]
    }
    const quarry = {
        text: 'select ai.id,ai.item_id,dbi.id as dispatch_box_id, c.category_name, di.box_no, dbi.item_qty as quantity from assigned_items as ai join dispatch_items di on di.id = ai.item_id join dispatch_box_items dbi on di.id = dbi.dispatch_item_id join categories c on dbi.item_id = c.category_id join dispatches d on d.dispatch_id = di.dispatch_id where ai.clients_id= $1 and d.dispatch_id= $2',
        values: [clientId, dispatchesId]
    }


    // console.log(query)
    try {
        const result = await dbPool.query(quarry);
        if (result) {
            return res.status(200).json({
                success: true,
                data: result.rows,
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

module.exports = router;

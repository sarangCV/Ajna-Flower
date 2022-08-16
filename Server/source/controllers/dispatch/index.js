const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});

router.get('/', applyMiddleware, async (req, res) => {
    // const sqlQuarry = {
    //     text: 'select dispatch_id as id, a.admin_name as dispatcher, dispatch_at as time from dispatches d inner join admin a on a.admin_id = d.dispatch_by where d.active= $1 order by id desc',
    //     values: [true]
    // };

    // text: 'select d.dispatch_id as id, a.admin_name as dispatcher, d.dispatch_at as time, d.assigned from dispatches d inner join admin a on a.admin_id = d.dispatch_by where d.active= $1 order by id desc',


    // const {isDispatched} = req.body;
    // console.log('hi---')
    // console.log(isDispatched)

    // const sqlQuarry = {
    //     text: 'select d.dispatch_id as id, d.dispatch_at as time, d.assigned, (select count(item_id) as boxes from dispatch_items where dispatch_id = d.dispatch_id and active = true) from dispatches as d where d.assigned =$1 and d.active = $2 order by id desc',
    //     values: [isDispatched, true]
    // }


    // const sqlQuarry = {
    //     text: 'select d.dispatch_id as id, a.admin_name as dispatcher, d.dispatch_at as time, d.assigned from dispatches d inner join admin a on a.admin_id = d.dispatch_by where d.active= $1 order by id desc',
    //     values: [true]
    // };
    //
    // const quarry = {
    //     text: 'select d.dispatch_id as id,d.dispatch_at as time, case when (select count(id) from dispatch_items where dispatch_id=d.dispatch_id ) = (select count(id) from assigned_items where dispatch_id=d.dispatch_id ) then true else false end as assigned  from dispatches as d where active =$1 order by d.dispatch_at desc',
    //     values: [true]
    // }

    const quarryNew = {
        text: 'select d.dispatch_id  as id, d.dispatch_at as time, case when (select count(id) from dispatch_items where dispatch_id = d.dispatch_id) = (select count(id) from assigned_items where dispatch_id = d.dispatch_id) then true else false end as assigned from dispatches as d where d.active = $1 order by d.dispatch_at desc',
        values: [true]
    }
    try {
        const result = await dbPool.query(quarryNew);
        if (result) {
            return res.status(200).json({
                success: true,
                dispatches: result.rows
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
/* ----------------------------------------------------- *
 *              STORE DISPATCH ITEMS                     *
 * ----------------------------------------------------- */
router.post('/', applyMiddleware, async (req, res) => {
    const {userId, dispatchItem, dispatchAt} = req.body;
    console.log(req)
    const client = await dbPool.connect()
    try {
        await client.query('BEGIN')
        const query = {
            text: 'insert into dispatches (dispatch_by,dispatch_at) values ($1, $2) returning dispatch_id',
            values: [userId, dispatchAt]
        }
        const dispatch = await client.query(query);
        const {dispatch_id} = dispatch.rows[0]
        const query1 = 'insert into dispatch_items (dispatch_id, box_no, dispatch_by) values ($1, $2, $3) returning id as box_id'
        const query2 = 'insert into dispatch_box_items (dispatch_item_id, item_id, item_qty) values ($1, $2, $3)'
        const sqlData = dispatchItem.map(async d => {
            const {id, items} = d
            const dispatchItems = await client.query(query1, [dispatch_id, id, userId]);
            const {box_id} = dispatchItems.rows[0]
            const boxItms = await items.map(async bd => {
                const {id, qty} = bd
                await client.query(query2, [box_id, id, qty]);
            })
        })
        await client.query('COMMIT').then(() => {
            return res.status(200).json({
                success: true,
                dispatchId: dispatch_id,
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
    } finally {
        client.release()
    }
});

/* ----------------------------------------------------- *
 *              GET DISPATCH ITEMS(Ready To assign)      *
 * ----------------------------------------------------- */

router.get('/dispatch-item', applyMiddleware, async (req, res) => {
    const dispatchId = req.headers['id']
    // const sqlQuarry = {
    //     text: ' select di.id, di.dispatch_id, di.item_id, coalesce(di.box_no, \'\') || \' | \' || coalesce(c.category_name, \'\') || \' | \' || coalesce(CAST(di.item_qty as varchar), \'\') || \' BN\'  as item_name from dispatch_items di inner join categories c on c.category_id = di.item_id where dispatch_id =$1 and di.active =$2',
    //     values: [dispatchId, true]
    // };

    // const sqlQuarry = {
    //     text: 'select di.id, di.dispatch_id, case when ai.item_id is not null then  true  else false end as is_assigned, di.item_id, coalesce(di.box_no, \'\') || \' | \' || coalesce(c.category_name, \'\') || \' | \' || coalesce(CAST(di.item_qty as varchar), \'\') || \' BN\'  as item_name from dispatch_items di inner join categories c on c.category_id = di.item_id left join assigned_items ai on di.id = ai.item_id where di.dispatch_id= $1 and di.active= $2 and ai.item_id is null',
    //     values: [dispatchId, true]
    // };

    // const quarry = {
    //     text: 'select di.id, di.dispatch_id,di.box_no, case when ai.item_id is not null then true else false end as is_assigned, blateral.items from dispatch_items di left join assigned_items ai on di.id = ai.item_id left join dispatch_box_items dbi on di.id = dbi.dispatch_item_id inner join categories c on c.category_id = dbi.item_id,lateral (select ARRAY((select  c.category_name || \'|\'|| item_qty::text||\' BN\' from dispatch_box_items  where dbi.active = true and dispatch_item_id = di.id)) as items) blateral where di.dispatch_id = $1 and di.active = $2 and ai.item_id is null',
    //     values: [dispatchId, true]
    // }
    const quarry = {
        text: 'select di.id, di.dispatch_id, di.box_no, case when ai.item_id is not null then true else false end as is_assigned, blateral.items from dispatch_items di left join assigned_items ai on di.id = ai.item_id, lateral (select ARRAY((select c.category_name || \'|\' || item_qty::text || \' BN\' from dispatch_box_items dbi inner join categories c on c.category_id = dbi.item_id where dbi.dispatch_item_id = di.id and dbi.active = true )) as items) blateral where di.dispatch_id = $1 and di.active = $2 and ai.item_id is null',
        values: [dispatchId, true]
    }

    try {
        const result = await dbPool.query(quarry);
        if (result) {
            // console.log(result)
            return res.status(200).json({
                success: true,
                message: result.rowCount === 0 ? 'There is no items left | items already assigned.' : 'Availabe items',
                clientsList: result.rows
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
 *              GET DISPATCHED ITEMS (Already assigned)  *
 * ----------------------------------------------------- */

router.get('/dispatched-item', applyMiddleware, async (req, res) => {
    const dispatchId = req.headers['id']

    // console.log(dispatchId)
    // const sqlQuarry = {
    //     text: 'select di.id, di.dispatch_id, case when ai.item_id is not null then  true  else false end as is_assigned, di.item_id, coalesce(di.box_no, \'\') || \' | \' || coalesce(c.category_name, \'\') || \' | \' || coalesce(CAST(di.item_qty as varchar), \'\') || \' BN\'  as item_name, c2.client_name from dispatch_items di inner join categories c on c.category_id = di.item_id left join assigned_items ai on di.id = ai.item_id left join clients c2 on c2.client_id = ai.clients_id where di.dispatch_id= $1 and di.active= $2 and ai.item_id is not null',
    //     values: [dispatchId, true]
    // };


    // const quarry = {
    //     text: 'select di.id, di.dispatch_id,di.box_no, case when ai.item_id is not null then true else false end as is_assigned, blateral.items from dispatch_items di left join assigned_items ai on di.id = ai.item_id left join dispatch_box_items dbi on di.id = dbi.dispatch_item_id inner join categories c on c.category_id = dbi.item_id,lateral (select ARRAY((select c.category_name || \'|\'|| item_qty::text||\' BN\' from dispatch_box_items  where dbi.active = true and dispatch_item_id = di.id)) as items) blateral where di.dispatch_id = $1 and di.active = $2 and ai.item_id is not null',
    //     values: [dispatchId, true]
    // }
    const quarry = {
        text: 'select di.id, di.dispatch_id, di.box_no, case when ai.item_id is not null then true else false end as is_assigned, blateral.items from dispatch_items di left join assigned_items ai on di.id = ai.item_id, lateral (select ARRAY((select c.category_name || \'|\' || item_qty::text || \' BN\' from dispatch_box_items dbi inner join categories c on c.category_id = dbi.item_id where dbi.dispatch_item_id = di.id and dbi.active = true )) as items) blateral where di.dispatch_id = $1 and di.active = $2 and ai.item_id is not null',
        values: [dispatchId, true]
    }

    try {
        const result = await dbPool.query(quarry);
        if (result) {
            console.log(result.rows)
            // console.log(result)
            return res.status(200).json({
                success: true,
                message: result.rowCount === 0 ? 'There is no items left | items already assigned.' : 'Availabe items',
                clientsList: result.rows
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
 *              GET DISPATCHED ITEMS                     *
 * ----------------------------------------------------- */


router.get('/dispatch-details/:dispatchId', applyMiddleware, async (req, res) => {
    const {dispatchId} = req.params
    console.log(dispatchId)
    // const sqlQuarry1 = {
    //     text: 'select di.id, di.dispatch_id, case when ai.item_id is not null then  true  else false end as is_assigned, di.item_id, coalesce(di.box_no, \'\') || \' | \' || coalesce(c.category_name, \'\') || \' | \' || coalesce(CAST(di.item_qty as varchar), \'\') || \' BN\'  as item_name from dispatch_items di inner join categories c on c.category_id = di.item_id  where di.dispatch_id= $1 and di.active= $2',
    //     values: [dispatchId, true]
    // };

    // const sqlQuarry1 = {
    //     text: 'select di.id, di.dispatch_id, case when ai.item_id is not null then  true  else false end as is_assigned, di.item_id, coalesce(di.box_no, \'\') || \' | \' || coalesce(c.category_name, \'\') || \' | \' || coalesce(CAST(di.item_qty as varchar), \'\') || \' BN\'  as item_name from dispatch_items di inner join categories c on c.category_id = di.item_id left join assigned_items ai on di.id = ai.item_id where di.dispatch_id= $1 and di.active= $2',
    //     values: [dispatchId, true]
    // };

    const quarry = {
        text: 'select di.id, di.dispatch_id, di.box_no, case when ai.item_id is not null then true else false end as is_assigned, blateral.items from dispatch_items di left join assigned_items ai on di.id = ai.item_id, lateral (select ARRAY((select c.category_name || \'|\' || item_qty::text || \' BN\' from dispatch_box_items dbi inner join categories c on c.category_id = dbi.item_id where dbi.dispatch_item_id = di.id and dbi.active = true )) as items) blateral where di.dispatch_id = $1 and di.active = $2',
        values: [dispatchId, true]
    }

    const sqlQuarry2 = {
        text: 'select id, dispatch_id, vehicle_no, vehicle_type, contact_person, contact_number, note, boxes from dispatch_transport where active= $1 and dispatch_id =$2',
        values: [true, dispatchId]
    };

    const client = await dbPool.connect()
    try {
        await client.query('BEGIN')
        const dispatch = await client.query(quarry);
        const transport = await client.query(sqlQuarry2);

        await client.query('COMMIT').then(() => {
            return res.status(200).json({
                success: true,
                data: {
                    dispatches: dispatch.rows,
                    transports: transport.rows
                },
                message: 'Dispatch details'
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
    } finally {
        client.release()
    }


});


/* ----------------------------------------------------- *
 *              STORE TRANSPORT DETAILS                  *
 * ----------------------------------------------------- */

router.post('/transport', applyMiddleware, async (req, res) => {
    const {userId, transportDetails} = req.body;
    // const sqlData = transportDetails.map(d => {
    //     return "(" + d.dispatchId + ",'" + d.vehicleNo + "','" + d.vehicleType + "','" + d.contactPerson + "'," + d.contactNumber + ",'" + d.dispatchTime + "','" + d.arriveTime + "','" + d.note + "',ARRAY[" + d.boxes + "])"
    // })
    // const query = `insert into dispatch_transport(dispatch_id, vehicle_no, vehicle_type, contact_person, contact_number, dispatch_time, arrive_time, note, boxes)values ${sqlData}`
    //


    const sqlData = transportDetails.map(d => {
        return "(" + d.dispatchId + ",'" + d.vehicleNo + "','" + d.vehicleType + "','" + d.contactPerson + "'," + d.contactNumber + ",'" + d.note + "',ARRAY[" + d.boxes + "])"
    })
    const query = `insert into dispatch_transport(dispatch_id, vehicle_no, vehicle_type, contact_person, contact_number,note, boxes)values ${sqlData}`


    dbPool.query({text: query}).then(r => {
        res.status(200).json({
            success: true,
            message: 'Transport details accepted'
        });
    }).catch(e => {
        console.log(e)
        res.status(400).json({
            success: false,
            status: 'error',
            code: 'DTD-E001',
            message: 'Sorry, transport details not accepted. Please try again.'
        });
    })
});
module.exports = router;

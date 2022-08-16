const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const dbPool = new Pool({connectionString: apiConfig.DB});

router.post('/', applyMiddleware, async (req, res) => {
    const {dateFrom, dateTo, clientId} = req.body;
    const query = {
        text: 'select d.dispatch_id as d_id, dispatch.box::INTEGER as d_boxes, dispatch.amount::INTEGER as d_total, date(d.dispatch_at) as d_date from dispatches as d,  lateral (select count(di.id) as box, count(di.id) as assigned ,sum(ii.total) as amount from dispatch_items di join assigned_items ai on di.id = ai.item_id full outer join invoice_items ii on di.id = ii.item_id  where di.dispatch_id = d.dispatch_id  and ai.clients_id =$1) as dispatch where d.active = true and dispatch_at between $2 and $3 order by d.dispatch_at desc',
        values: [clientId, dateFrom, dateTo]
    }
    const query2 = {
        text: 'select d.dispatch_id as d_id, dispatch.box::INTEGER as d_boxes, dispatch.amount::INTEGER as d_total, date(d.dispatch_at) as d_date from dispatches as d,  lateral (select count(di.id) as box, count(di.id) as assigned ,sum(ii.total) as amount from dispatch_items di full outer join invoice_items ii on di.id = ii.item_id  where di.dispatch_id = d.dispatch_id) as dispatch where d.active = true and dispatch_at between $1 and $2 order by d.dispatch_at desc',
        values: [dateFrom, dateTo]
    }
    try {
        const result = await dbPool.query(clientId ? query : query2);
        if (result) {
            console.log(result)
            const {rowCount, rows} = result
            if (rowCount > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Report data',
                    data: {
                        boxesCount: rows.reduce((accum, item) => accum + item.d_boxes, 0),
                        totalAmount: rows.reduce((accum, item) => accum + item.d_total, 0),
                        detailedData: rows
                    }
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'no data found',
                    data: null
                });
            }
        }
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});


module.exports = router;

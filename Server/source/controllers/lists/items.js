const {Pool} = require('pg');
const express = require('express');
const router = express.Router();
const apiConfig = require('../../configuration');
const applyMiddleware = require('../../middleware/super-admin')
const userPool = new Pool({connectionString: apiConfig.DB});

router.get('/', applyMiddleware, async (req, res) => {
    const sqlQuarry = {
        text: 'select category_id as id, category_name as name from categories where active=$1',
        values: [true]
    };
    try {
        const result = await userPool.query(sqlQuarry);
        if (result) {
            return res.status(200).json({
                success: true,
                categoriesList: result.rows
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
    const {itemName, qtyPerBunch} = req.body
    const sqlQuarry = {
        text: 'insert into categories(category_name, steam_per_bunch) values ($1, $2)',
        values: [itemName, qtyPerBunch]
    };
    try {
        const result = await userPool.query(sqlQuarry);
        if (result) {
            return res.status(200).json({
                success: true,
                message: 'New item added.'
            });
        }
    } catch (e) {
        return res.status(404).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});



router.get('/delete/:categoryId', applyMiddleware, async (req, res) => {
    const {categoryId} = req.params;
    const quarry = {
        text: 'update categories set active= false where category_id =$1',
        values: [categoryId]
    }
    userPool.query(quarry).then(r => {
        res.status(200).json({
            success: true,
            message: 'Item disabled'
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

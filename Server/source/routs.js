/*-----------------------------------------------------------*
 *    @author  : Prashant Gaurav                             *
 *    @module : api routing to redirect to specific file     *
 *-----------------------------------------------------------*/
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const appConfig = require('./configuration');
const login = require('./controllers/auth/login');
const itemsList = require('./controllers/lists/items');
const clientsList = require('./controllers/lists/byers');
const companiesList = require('./controllers/lists/companies');
const dispatches = require('./controllers/dispatch');
const master = require('./controllers/master');
const pricing = require('./controllers/master/pricing');
const invoices = require('./controllers/invoices');
const reports = require('./controllers/reports');

const expenses = require('./controllers/expenses');
const manualInvoices = require('./controllers/invoices/manual-invoice');



const boxes = require('./controllers/boxes');



/* ---------------------------- *
 *         DATA PARSING         *
 * ---------------------------- */
const app = express();
app.use('/docs/logo/', express.static('./docs/logo/'));
app.use('/docs/invoices/', express.static('./docs/invoices/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression())
/*------------------------------------------------------------*
 *                       API SECURITY                         *
 *------------------------------------------------------------*/
app.use(express.json({limit: '5kb'}));
app.use(helmet.xssFilter())
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests, please try again later',
});
app.use(limiter)
app.use(compression())
app.use(cors());

/* ----------------------------------------------------------- *
 *                 ROUTS TO HANDLE ADMIN REQUEST               *
 * ----------------------------------------------------------- */
app.use(`${appConfig.URL_PATTERN}/auth/login`, login);
app.use(`${appConfig.URL_PATTERN}/items-list`, itemsList);
app.use(`${appConfig.URL_PATTERN}/clients-list`, clientsList);
app.use(`${appConfig.URL_PATTERN}/companies-list`, companiesList);
app.use(`${appConfig.URL_PATTERN}/dispatch`, dispatches);
app.use(`${appConfig.URL_PATTERN}/master`, master);
app.use(`${appConfig.URL_PATTERN}/master/pricing`, pricing);
app.use(`${appConfig.URL_PATTERN}/invoices`, invoices);
app.use(`${appConfig.URL_PATTERN}/reports`, reports);

app.use(`${appConfig.URL_PATTERN}/boxes`, boxes)

app.use(`${appConfig.URL_PATTERN}/expenses`, expenses);
app.use(`${appConfig.URL_PATTERN}/manual-invoice`, manualInvoices);


/* ----------------------------------------------------------- *
 *                      ERROR HANDLING                         *
 * ----------------------------------------------------------- */
app.use((req, res, next) => {
    const error = new Error('Sorry, the requested URL was not found.');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error.message)
    res.status(error.status || 500);
    res.json({
        message: 'Oops something went wrong',
        hint: error.message
    });
});
module.exports = app;

import {baseUrl} from '../configuration/index';


export const getInvoiceList = async (token) => {

    const URL = `${baseUrl}/invoices`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
    };

    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        return resData;
    });
};

export const generateInvoice = async (invoiceId, companyId, token) => {
    const URL = `${baseUrl}/invoices`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
        body: JSON.stringify({invoiceId, companyId})
    };

    return await fetch(URL, requestOptions).then((response) => response.json()).then((resData) => {
        return resData;
    });
};

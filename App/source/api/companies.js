import { baseUrl } from '../configuration/index';

export const getCompaniesList = async (token) => {

    const URL = `${baseUrl}/companies-list`;
    const requestOptions = {
        method: 'get',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', token},
    };

    return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((resData) => {
        return resData;
    });
};

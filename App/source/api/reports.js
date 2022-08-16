import { baseUrl} from '../configuration/index';

export const submitReport = async (dateFrom, dateTo, clientId, token) => {
    const URL = `${baseUrl}/reports`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json',token},
        body: JSON.stringify({
            dateFrom, dateTo, clientId
        })
    };

    return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((resData) => {
        return resData;
    });
    // console.log(requestOptions.body, token)
};
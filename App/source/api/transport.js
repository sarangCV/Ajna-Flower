import { baseUrl} from '../configuration/index';

export const transportData = async (transportDetails, token) => {
    const URL = `${baseUrl}/dispatch/transport`;
    const requestOptions = {
        method: 'post',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json',token},
        body: JSON.stringify({
            transportDetails
        })
    };

    return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((resData) => {
        return resData;
    });
    // console.log(transportDetails, token)
};
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {FlatList, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {authTokenKey} from '../../../configuration';
import {fetchData} from '../../../service/AsyncStorage';
import {getInvoiceList, generateInvoice} from '../../../api/invoice';
import {getCompaniesList} from '../../../api/companies'
import Loading from '../../../components/Loading';
import InvoiceCard from '../../../components/invoice/card'

moment.locale('en-IN');

const InvoiceScreen = ({navigation}) => {
    const [loading, setLoading] = React.useState(true)
    const [loadingText, setLoadingText] = React.useState('Loading data, please wait..!')
    const [authToken, setAuthToken] = useState(null);
    const [clientsList, setClientsList] = useState(null);
    const [companies, setCompanies] = React.useState(null)

    useEffect(() => {
        getAuthToken()
    }, [])

    const getAuthToken = async () => {
        await fetchData(authTokenKey).then(async (token) => {
            setAuthToken(token)
            await getAssignedPriceList(token)
            await getCompanyList(token)
        })
    };


    const getCompanyList = async token => {
        setLoading(true)
        await getCompaniesList(token).then(async (c) => {
            const {success, companiesList, message} = c
            if (success) {
                setLoading(false)
                setCompanies(companiesList)
            } else {
                alert(message)
            }
        })
    }

    const getAssignedPriceList = async token => {
        await getInvoiceList(token).then((res) => {
            setLoading(false)
            const {success, clientsList, message} = res;
            if (success) {
                setClientsList(clientsList)
            } else {
                alert(message)
            }
        })
    }


    const generateInvoiceHandler = async (invoiceId, companyId) => {
        setLoading(true)
        setLoadingText('Generating invoice, please wait..!')
        await generateInvoice(invoiceId, companyId, authToken).then(async (res) => {
            const {success, message, downloadLink} = res;
            await getCompanyList(authToken)
            if (success) {
                setLoadingText('Invoice generated.')
                setLoading(false)
                // Linking.openURL(`${downloadLink}`)
            } else {
                alert(message)
                setLoadingText(message)
                setLoading(false)

            }
        })
    };

    return (
        <>
            <View style={styles.container}>
                {loading ?
                    <Loading text={loadingText}/> :
                    <FlatList
                        // style={{paddingTop: 40}}
                        data={clientsList}
                        renderItem={({item}) => <InvoiceCard generateInvoice={generateInvoiceHandler} companies={companies} data={item}/>}
                        keyExtractor={(item) => item.invoice_id.toString()}
                    />}
                {/*<TouchableOpacity*/}
                {/*    style={{*/}
                {/*        position: 'absolute',*/}
                {/*        bottom:5,*/}
                {/*        left: 0,*/}
                {/*        // right: 0,*/}
                {/*        backgroundColor: 'blue',*/}
                {/*        // paddingHorizontal:10,*/}
                {/*        padding: 10,*/}
                {/*        marginHorizontal: 15,*/}
                {/*        marginVertical: 5,*/}
                {/*        alignItems: 'center',*/}
                {/*        justifyContent: 'center'*/}
                {/*    }}><Text style={{color: '#fff'}}>Generate Manual Invoice</Text></TouchableOpacity>*/}

            </View>
        </>
    )
        ;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e3e3',
        paddingHorizontal: 12
    },
    list: {
        marginTop: 12,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'column'
    },
    inputGroup: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    download: {
        backgroundColor: '#000',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    }

});

export default InvoiceScreen;

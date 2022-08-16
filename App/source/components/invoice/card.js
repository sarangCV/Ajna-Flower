import React from 'react';
import moment from 'moment';
import {TouchableOpacity, Text, View, StyleSheet, Share, Linking} from 'react-native';
import {Picker} from "@react-native-community/picker";

const Headers = ({generateInvoice, companies, data}) => {
    const {invoice_id, invoice_date, client_name, company_name, download_url} = data;
    const [selectedCompany, setSelectedCompany] = React.useState(null)

    const generateInvoiceTapped = async () => {
        if (selectedCompany) {
            await generateInvoice(invoice_id, selectedCompany)
        } else {
            alert('Please select a company to generate invoice')
        }
    };

    const downloadInvoiceTapped = (downloadLink) => {
        Linking.openURL(`${downloadLink}`)
    }


    const onShare = async (downloadLink) => {
        try {
            const result = await Share.share({
                message: `Please Download invoice using link: ${downloadLink.replace(/ /g, '%20')}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <TouchableOpacity style={styles.list}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Text>{moment(invoice_date).format('DD/MM/YYYY')}</Text></View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    {company_name &&
                    <Text style={{fontSize: 14, textTransform: 'lowercase'}}> From: {company_name}</Text>}
                </View>
            </View>
            <View style={styles.listBody}>
                <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                    {!company_name && <Text style={{fontSize: 14}}>Select Company:</Text>}
                    {!company_name && companies &&
                    <Picker
                        mode='dialog'
                        selectedValue={selectedCompany}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedCompany(itemValue)}>
                        {companies.map((item) => <Picker.Item key={item.id} label={item.name} value={item.id}/>)}
                    </Picker>}
                </View>
                <Text style={{fontSize: 14}}>To Client: {client_name}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                {download_url ?
                    <TouchableOpacity style={styles.download} onPress={() => downloadInvoiceTapped(download_url)}>
                        <Text style={{color: '#fff', fontSize: 16}}>View</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.download} onPress={generateInvoiceTapped}>
                        <Text style={{color: '#fff', fontSize: 16}}>Generate</Text>
                    </TouchableOpacity>
                }
                {download_url &&
                <TouchableOpacity style={styles.download} onPress={() => onShare(download_url)}>
                    <Text style={{color: '#fff', fontSize: 16}}>Share</Text>
                </TouchableOpacity>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    list: {
        marginTop: 12,
        backgroundColor: '#fff',
        // padding: 5,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 2,
        flexDirection: 'column'
    },
    listBody: {
        flexDirection: 'column',
        paddingVertical: 5,
        marginVertical: 5,
        borderTopWidth: 0.4,
        borderTopColor: '#aeaeae'
    },
    picker: {
        flex: 1,
        marginLeft: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    download: {
        flex: 1,
        margin: 10,
        backgroundColor: '#000',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    }
});

export default Headers;

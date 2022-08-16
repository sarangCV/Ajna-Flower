import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';

moment.locale('en-IN');

const GeneratedInvoiceScreen = ({ navigation, route }) => {

    const [message, setMessage] = useState(null);
    const [downloadLink, setDownloadLink] = useState([]);

    useEffect(() => {
        const { message, downloadLink } = route.params;
        setMessage(message);
        setDownloadLink(downloadLink);
    }, [])


    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor='#fff'/>
            <View style={styles.container}>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>{message}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(`${downloadLink.replace(/ /g, '%20')}`)}>
                    <Text>{downloadLink}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },

});

export default GeneratedInvoiceScreen;

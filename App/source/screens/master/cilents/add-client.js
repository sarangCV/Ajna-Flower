import React from 'react'
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler';
import {addClients} from '../../../api/clients';
import InputBox from '../../../components/dispatch/inputbox';
import { authTokenKey } from '../../../configuration';
import {fetchData} from '../../../service/AsyncStorage';

const Clients = ({navigation, route}) => {

    const [loading, setLoading] = React.useState(false);
    const [authToken, setAuthToken] = React.useState(null);
    const [clientName, setClientName] = React.useState(null);
    const [clientShortName, setClientShortName] = React.useState(null);
    const [clientEmail, setClientEmail] = React.useState(null);
    const [clientNumber, setClientNumber] = React.useState(null);
    const [clientAddress, setClientAddress] = React.useState(null);
    const [clientCountry, setClientCountry] = React.useState(null);
    const [clientState, setClientState] = React.useState(null);
    const [clientCity, setClientCity] = React.useState(null);
    const [clientZip, setClientZip] = React.useState(null);
    const [gstNo, setGstN0] = React.useState(null);


    React.useEffect(() => {
        fetchData(authTokenKey).then((token) => {
            setAuthToken(token);
        })
    }, []);
    const onSubmit = async () => {
        const clientDetails = {
            clientName,
            clientShortName,
            clientEmail,
            gstNo,
            clientNumber,
            clientAddress,
            clientCountry,
            clientState,
            clientCity,
            clientZip
        }
        // setLoading(true)
        await addClients(authToken, clientDetails).then((res) => {
            const {success, message} = res;
            if (success) {
                Alert.alert(
                    'Client added successfully..!', 'Press okay to View Clients.',
                    [
                        {
                            text: "Okay",
                            onPress: () => navigation.navigate('Clients'),
                            style: "cancel"
                        },
                    ],
                    {cancelable: false}
                );
            } else {
                alert(message)
            }
        })
    }

    return (
        <>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.inputGroup}>
                        <View style={styles.idBox}>
                            <View style={{alignItem: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 17, fontWeight: 'bold'}}>Client Details</Text>
                            </View>
                        </View>
                        <InputBox
                            size={{width: '100%', height: 40,}}
                            text='Company Name'
                            onChangeText={(value) => {
                                setClientName(value)
                            }}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='Client Name'
                            onChangeText={(value) => {
                                setClientShortName(value)
                            }}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='GST NO'
                            onChangeText={(value) => {
                                setGstN0(value)
                            }}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='Email'
                            onChangeText={(value) => {
                                setClientEmail(value)
                            }}
                            // value={item.contactNumber}
                            maxLength={255}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='Contact Number'
                            onChangeText={(value) => {
                                setClientNumber(value)
                            }}
                            textContentType='telephoneNumber'
                            keyboardType='numeric'
                            maxLength={16}
                            // value={item.vehicleNo}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='Address'
                            onChangeText={(value) => {
                                setClientAddress(value)
                            }}
                            // value={item.vehicleType}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='Country'
                            onChangeText={(value) => {
                                setClientCountry(value)
                            }}
                            // value={item.vehicleType}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='State'
                            onChangeText={(value) => {
                                setClientState(value)
                            }}
                            // value={item.vehicleType}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='City'
                            onChangeText={(value) => {
                                setClientCity(value)
                            }}
                            // value={item.vehicleType}
                        />
                        <InputBox
                            size={{width: '100%', height: 40}}
                            text='Pincode'
                            onChangeText={(value) => {
                                setClientZip(value)
                            }}
                            // textContentType='telephoneNumber'
                            keyboardType='numeric'
                            // value={item.note}
                        />

                    </View>
                </ScrollView>

                <View style={styles.addBoxView}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => onSubmit()}>
                        <Text style={{color: '#fff'}}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({

    idBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingVertical: 5,
    },
    inputGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#c6c6c6',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#ececec',
        padding: 15
    },
    addBoxView: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 15,
    },
    submitButton: {
        flex: 1,
        minHeight: 40,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default Clients

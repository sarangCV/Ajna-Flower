import React from 'react';
import moment from 'moment';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {assignItems, getDispatchedItem, getDispatchItem} from '../../../api/dispatch';
import {getClientsList} from '../../../api/clients';
import Loading from '../../../components/Loading';

moment.locale('en-IN');


const MasterScreen = ({navigation, route}) => {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [loading, setLoading] = React.useState(true)
    const [dispatchId, setDispatchId] = React.useState(null);
    const [dispatchDate, setDispatchDate] = React.useState(null);
    const [authToken, setAuthToken] = React.useState(null)

    const [clientsList, setClientsList] = React.useState(null)
    const [dispatchItems, setDispatchItems] = React.useState([])
    const [dispatchedItems, setDispatchedItems] = React.useState([])
    const [selectedClient, setSelectedClient] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState([])


    React.useEffect(() => {
        const {dispatchesId, date, authToken} = route.params;
        setAuthToken(authToken);
        setDispatchDate(date)
        setDispatchId(dispatchesId);
        getItemList(dispatchesId, authToken);
    }, [])


    /* --------------------------------------------------- *
     *             Fetching data from server               *
     * --------------------------------------------------- */
    const getItemList = async (dispatchId, authToken) => {
        await getDispatchItem(dispatchId, authToken).then(async (res) => {
            console.log(res)
            const {success, clientsList} = res;
            if (success) {
                await setDispatchItems(clientsList)
            } else {
                console.log(res.message)
            }
        })

        await getDispatchedItem(dispatchId, authToken).then(async (res) => {
            console.log(res)
            const {success, clientsList} = res;
            if (success) {
                await setDispatchedItems(clientsList)
            } else {
                console.log(res.message)
            }
        })

        await getClientsList(authToken).then(async (res) => {
            setLoading(false)
            const {success, clientsList} = res;
            if (success) {
                await setSelectedClient(clientsList[0].id)
                await setClientsList(clientsList);
            } else {
                console.log(res.message)
            }
        })
    };


    const toggleDispatchItems = async (id) => {
        const isDuplicate = await selectedItem.includes(id)
        if (!isDuplicate) {
            setSelectedItem([...selectedItem, id])
        } else {
            const index = selectedItem.indexOf(id);
            if (index > -1) {
                selectedItem.splice(index, 1);
            }
            setSelectedItem(selectedItem)
        }
        forceUpdate()
    }


    const isItemSelected = (id) => {
        return selectedItem.includes(id)
    }


    const reConfirmation = () => {
        const selectedClientName = clientsList.find(x => x.id === selectedClient).name;
        if (clientsList && selectedItem.length != 0) {
            Alert.alert(`Are you sure, you want to assign `, `${selectedItem.length} Boxes to ${selectedClientName} ?`, [{
                    text: 'no',
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                    {text: 'yes', onPress: () => submitItems()}
                ],
                {cancelable: false}
            );
        } else {
            alert('Please select at-list one box and one client')
        }
    }

    const submitItems = async () => {
        await assignItems(dispatchId, selectedClient, selectedItem, authToken).then((res) => {
            const {success, message} = res;
            if (success) {
                Alert.alert(
                    message, 'If u want to assign other item to clients select Yes',
                    [
                        // {
                        //     text: "Assign Price",
                        //     // onPress: () => navigation.navigate('AssignPrice'),
                        //     onPress: () => navigation.navigate('AssignPrice', {clientId: selectedClient, dispatchDate}),
                        //
                        //     style: "cancel"
                        // },
                        {
                            text: "No",
                            onPress: () => navigation.goBack(),
                            // onPress: () => navigation.navigate('DispatchesList'),
                            style: "cancel"
                        },
                        {
                            text: "Yes", onPress: async () => {
                                await setSelectedClient(clientsList[0]), await getItemList(dispatchId, authToken), await setSelectedItem([])
                            }
                        }
                    ],
                    {cancelable: false}
                );
            } else {
                alert(message)
            }
        })
    };
    console.log(dispatchItems)
    return (
        <>
            {loading ?
                <Loading text='Loading, please wait..!'/> :
                <View style={styles.container}>
                    <View style={{backgroundColor: '#fff', borderRadius: 5, padding: 5}}>
                        <View style={styles.selectBox}>
                            <Text style={{fontSize: 15}}>Select Client:- </Text>
                            <ScrollView horizontal={true}>
                                {clientsList && clientsList.map((d, i) =>
                                    <TouchableOpacity key={i} style={d.id == selectedClient ? styles.toggleButtonSelected : styles.toggleButton} onPress={() => setSelectedClient(d.id)}>
                                        <Text style={{color: d.id == selectedClient ? 'white' : 'black'}}>{d.name}</Text>
                                    </TouchableOpacity>)}
                            </ScrollView>
                        </View>
                        <ScrollView style={styles.selectBox}>
                            <Text style={{fontSize: 15}}>Select Boxes:- </Text>
                            {dispatchItems && dispatchItems.map((d, i) =>
                                <TouchableOpacity onPress={() => toggleDispatchItems(d.id)} style={isItemSelected(d.id) ? styles.toggleButtonSelected : styles.toggleButton}>
                                    <Text style={{color: selectedItem.includes(d.id) ? 'white' : 'black'}}>{d.box_no}--</Text>
                                    <View style={{flexDirection: 'column'}}>
                                        {d.items && d.items.map(di => <Text style={{color: selectedItem.includes(d.id) ? 'white' : 'black', marginLeft: 5}}> {di}</Text>)}
                                    </View>
                                </TouchableOpacity>)}
                            <TouchableOpacity style={styles.submitButton} onPress={reConfirmation}>
                                <Text style={{fontSize: 16, color: '#fff', textTransform: 'uppercase'}}>Assign items to seller</Text>
                            </TouchableOpacity>
                            {dispatchedItems && dispatchedItems.map((d, i) =>
                                <View style={styles.assignItems}>
                                    <Text style={{color: selectedItem.includes(d.id) ? 'white' : 'black'}}>{d.box_no}--</Text>
                                    <View style={{flexDirection: 'column'}}>
                                        {d.items && d.items.map(di => <Text style={{color: 'green', marginLeft: 5}}> {di}</Text>)}
                                    </View>
                                </View>
                            )}
                            <View style={{width: '100%', height: 120}}/>
                        </ScrollView>
                    </View>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    selectBox: {
        flexDirection: 'column',
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 10,
        margin: 10,
        borderRadius: 5
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 8,
        marginVertical: 5,
        borderRadius: 3,
        width: 'auto',
        borderColor: 'gray',
        borderWidth: 0.6,
        backgroundColor: '#f3f3f3'
    },
    toggleButtonSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 8,
        marginVertical: 5,
        borderRadius: 3,
        width: 'auto',
        borderColor: 'gray',
        borderWidth: 0.6,
        backgroundColor: '#444444',
    },
    assignItems: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#7c5151',
        paddingHorizontal: 10,
        paddingVertical: 5,
        // marginRight: 8,
        marginVertical: 5,
        borderRadius: 3,
        width: 'auto',
        borderColor: 'green',
        borderWidth: 0.6,
    },

    container: {
        flex: 1,
        backgroundColor: '#e5e3e3',
        justifyContent: 'space-between',
        padding: 10
    },
    body: {
        flex: 12,
        backgroundColor: '#fff'

    },

    item: {
        height: 60,
        justifyContent: 'center',
        margin: 2,
        padding: 20,
        backgroundColor: 'white'
    },
    pickerStyle: {
        height: 40,
        width: '100%',
        alignItems: 'center'
    },
    clientPickerView: {
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#c6c6c6',
        padding: 5,
        marginBottom: 5
    },
    dispatchPickerView: {
        height: 40,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#c6c6c6'
    },
    submitButton: {
        // flex:1,
        marginTop: 20,
        height: 45,
        width: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 20,
        borderWidth: 1,
        borderColor: '#c6c6c6',
        borderRadius: 5
    }
});

export default MasterScreen;

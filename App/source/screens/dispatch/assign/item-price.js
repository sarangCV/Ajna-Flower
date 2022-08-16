import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {Picker} from '@react-native-community/picker';
import {fetchData} from '../../../service/AsyncStorage';
import {authTokenKey} from '../../../configuration';
import {getClientsList} from '../../../api/clients';
import {assignedItems} from '../../../api/assignedItems';
import {assignPrice} from '../../../api/assignPrice';
import {assignCalculatedPrice} from '../../../api/calculatedPrice';


const ItemPrice = ({navigation, route}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [assignedDate, setAssignedDate] = useState(null);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [clientsList, setClientsList] = useState([]);
    const [authToken, setAuthToken] = useState(null);
    const [dataList, setDataList] = useState([])
    const [totalPrice, setTotalPrice] = useState([])
    const [dispatchesId, setDispatchesId] = React.useState(null)

    useEffect(() => {
        getItems();
    }, []);


    React.useEffect(() => {
        if (route.params) {
            console.log('----------------')
            console.log(route.params)
            const {clientId, dispatchDate, dispatchesId} = route.params;
            setSelectedClientName(clientId)
            setDispatchesId(dispatchesId)
            setAssignedDate(moment(dispatchDate).format('YYYY-MM-DD'));

        }
    }, [])

    console.log(selectedClientName)

    const getItems = async () => {
        await fetchData(authTokenKey).then(async (token) => {
            setAuthToken(token)
            await getClientsList(token).then((res) => {
                const {success, clientsList} = res;
                if (success) {
                    setClientsList(clientsList);
                } else {
                    console.error(res.message)
                }
            })
        })
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setAssignedDate(moment(date).format('YYYY-MM-DD'));
        hideDatePicker();
    };

    const onSubmitEditHandler = async (item) => {
        const index = dataList.indexOf(item);
        // transportCost
        let itemPrice = {
            itemId: dataList[index].itemId,
            price: dataList[index].price,
            transportCost: dataList[index].transportCost,
            dispatchBoxId: dataList[index].dispatchBoxId
        };
        await assignPrice(itemPrice, authToken).then((res) => {
            const {success, quantity, total} = res;
            if (success) {
                // changes the value of total from the dataList
                let list = [...dataList];
                list[index].total = total
                list[index].quantity = quantity
                setDataList(list)
                let totalPrice = []
                list.forEach(element => {
                    totalPrice = [...totalPrice, element.total]
                });
                const sum = totalPrice.reduce((a, b) => {
                    return a + b;
                }, 0);
                setTotalPrice(sum)
            } else {
                console.log('failed to retrieve data: total')
            }
        })
    };

    const findItemTapped = async () => {
        if (assignedDate !== null) {
            let items = {clientId: selectedClientName, dispatchesId: dispatchesId, assigningDate: assignedDate}
            // console.log(items)
            await assignedItems(items, authToken).then((res) => {
                console.log(res)
                const {success, data} = res;
                if (success) {
                    console.log(data)
                    if (data.length !== 0) {
                        let filtered = [];
                        for (let i = 0; i < data.length; i++) {
                            filtered = [...filtered, {
                                id: data[i].id,
                                itemId: data[i].item_id,
                                categoryName: data[i].category_name,
                                dispatchBoxId: data[i].dispatch_box_id,
                                price: 0,
                                quantity: data[i].quantity,
                                transportCost: 0,
                                total: null
                            }];
                            setDataList(filtered);
                        }
                    } else {
                        setDataList([]);
                        alert(' No data found')
                    }
                } else {
                    console.warn(res.message);
                }
            })
        } else {
            alert('Please select a date');
        }
    };

    const storeItemPrice = (item, price) => {
        const index = dataList.indexOf(item);
        let itemPrice = [...dataList];
        itemPrice[index].price = price
    };

    const storeItemTransportCost = (item, transportCost) => {
        const index = dataList.indexOf(item);
        let itemPrice = [...dataList];
        itemPrice[index].transportCost = transportCost
    };

    const validatePrices = () => {
        let price = true;
        dataList.forEach((ele) => {
            if (ele.price === 0) {
                price = false;
            }
        })
        return price;
    };

    const onSubmitHandler = async () => {
        if (dataList.length !== 0) {
            let isPrice = validatePrices()
            if (isPrice === true) {
                let itemsPricing = [];
                dataList.forEach(element => {
                    itemsPricing = [...itemsPricing, {
                        itemId: element.itemId,
                        price: element.price,
                        dispatchBoxId: element.dispatchBoxId,
                        transportCost: element.transportCost,
                        total: element.total
                    }]
                });
                await assignCalculatedPrice(selectedClientName, itemsPricing, authToken).then((res) => {
                    const {success, message} = res;
                    if (success) {
                        alert(message)
                    } else {
                        alert(message)
                    }
                })
                // console.log(selectedClientName);
            } else {
                alert('Enter prices');
            }
        } else {
            alert('Please choose date and prices')
        }
    };

    return (
        <>
            <View style={styles.container}>
                <ScrollView>
                    <View style={{
                        flexDirection: 'column',
                        width: '100%',
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 5
                    }}>
                        <View style={styles.inputBgStyle}>
                            <Text style={{fontSize: 16, color: 'gray', width: '50%', textAlignVertical: 'center'}}>Select
                                Client</Text>
                            <Picker mode='dialog' selectedValue={selectedClientName} style={styles.pickerStyle}
                                    onValueChange={(itemValue) => setSelectedClientName(itemValue)}>{clientsList && clientsList.map((item) =>
                                <Picker.Item key={item.id} label={item.name} value={item.id}/>)}</Picker>
                        </View>
                        {/*<TouchableOpacity style={[styles.inputBgStyle, {*/}
                        {/*    justifyContent: 'flex-start',*/}
                        {/*    width: '100%',*/}
                        {/*    alignItems: 'center',*/}
                        {/*    flexDirection: 'row'*/}
                        {/*}]} onPress={showDatePicker}>*/}
                        {/*    <Icon name='today' size={20} color='black'/>*/}
                        {/*    <Text style={{*/}
                        {/*        color: 'black',*/}
                        {/*        fontSize: 16,*/}
                        {/*        paddingLeft: 6*/}
                        {/*    }}>{assignedDate ? moment(assignedDate).format('DD-MM-YYYY') : 'Select a date'}</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker}/>*/}
                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            backgroundColor: '#1d8d3c',
                            height: 40,
                            borderRadius: 5
                        }} onPress={findItemTapped}>
                            <Text style={{color: '#fff'}}>Find Items</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        width: '100%',
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10
                    }}>


                        <View style={styles.diCard}>
                            <View style={{flex: 2}}>
                                <Text>Item</Text>
                            </View>
                            <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{flex: 1}}>
                                    <Text>Price/BN</Text>
                                </View>
                                <Text style={{paddingRight: 5}}>QTY</Text>
                            </View>
                            <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
                                <Text>Transport</Text>
                            </View>
                            <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                <Text style={{color: 'black'}}> ₹ Total</Text>
                            </View>
                        </View>


                        {dataList && dataList.map((item, i) => {
                            return (
                                <View key={i} style={styles.diCard}>
                                    <View style={{flex: 2}}>
                                        <Text>{item.categoryName}</Text>
                                    </View>
                                    <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={styles.inputBox}>
                                            <TextInput
                                                multiline={false} numberOfLines={1} maxLength={5}
                                                placeholder='Price/punch' keyboardType='numeric'
                                                onSubmitEditing={() => onSubmitEditHandler(item)}
                                                onBlur={() => onSubmitEditHandler(item)} onChangeText={price => {
                                                storeItemPrice(item, price)
                                            }}/>
                                        </View>
                                        <Text>* {item.quantity}</Text>
                                    </View>
                                    <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={styles.inputBox}>
                                            <TextInput multiline={false} numberOfLines={1} maxLength={5}
                                                       placeholder='Transport cost' keyboardType='numeric'
                                                       onSubmitEditing={() => onSubmitEditHandler(item)}
                                                       onBlur={() => onSubmitEditHandler(item)} onChangeText={price => {
                                                storeItemTransportCost(item, price)
                                            }}/>
                                        </View>
                                    </View>
                                    <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <Text style={{color: 'black'}}> ₹ {item.total ? item.total : '--'}</Text>
                                    </View>
                                </View>
                            )
                        })}
                        <View style={{width: '100%', height: 40, alignItems: 'flex-end', justifyContent: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#c6c6c6'}}>
                            <Text style={{fontSize: 16, color: 'blue'}}>Total: ₹ {totalPrice}</Text>
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={onSubmitHandler}>
                            <Text style={{fontSize: 16, color: '#fff'}}>Submit for Invoice Generation</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e3e3',
        paddingTop: 10,
        paddingHorizontal: 8,
    },
    pickerView: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#c6c6c6',
        padding: 5,
    },
    inputBgStyle: {
        width: '100%',
        flexDirection: 'row',
        height: 45,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        alignItems: 'center',
        // justifyContent: 'center',
        borderColor: '#000',
        backgroundColor: '#fff'
    },
    datePickerView: {
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
    datePicker: {
        marginVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        // backgroundColor: 'blue'
    },
    pickerStyle: {
        height: 50,
        width: '50%',
        alignItems: 'center',
    },
    inputBox: {
        flex: 2,
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#c6c6c6',
        borderRadius: 5,
        marginLeft: 5
    },
    footer: {
        height: '20%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    submitButton: {
        height: 40,
        width: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 20,
        borderWidth: 1,
        borderColor: '#c6c6c6',
        borderRadius: 5,
        marginVertical: 25
    },
    diCard: {
        flexDirection: 'row',
        width: '100%',
        height: 42,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 10
    }
});

export default ItemPrice;

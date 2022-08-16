import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {FlatList, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {authTokenKey} from '../../configuration';
import {getCategory} from '../../api/category';
import {dispatchData} from '../../api/dispatch';
import {fetchData} from '../../service/AsyncStorage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from "../../components/Loading";
import {pickerBorder} from '../../assets/colors';

moment.locale('en-IN');


const DispatchScreen = ({navigation, navigation: {goBack}}) => {
    const [loading, setLoading] = React.useState(true);
    const [categories, setCategories] = React.useState(null);
    const [authToken, setAuthToken] = React.useState([])
    const [selectedItemValue, setSelectedItemValue] = React.useState(1);
    // const [lastQty, setLastQty] = React.useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dispatchAt, setDispatchAt] = React.useState(null);
    const [dispatches, setDispatches] = React.useState(null)


    useEffect(() => {
        getDispatchItemList();
    }, [])

    //Getting the data
    const getDispatchItemList = async () => {
        fetchData(authTokenKey).then((token) => {
            setAuthToken(token)
            getCategory(token).then((res) => {
                setLoading(false)
                const {success, categoriesList} = res;
                if (success) {
                    setCategories(categoriesList)
                    setDispatches([{
                        index: 0,
                        id: "B" + `${1}`.padStart(3, '0'),
                        items: [
                            {
                                id: categoriesList[0].id,
                                name: categoriesList[0].name,
                                qty: ""
                            }
                        ]
                    }])
                } else {
                    alert(res.message)
                }
            })
        })
    }

    //Adding items to the screen
    const addItems = () => {
        const {id, name} = categories[0]
        let index = 0
        if (dispatches == 0) {
            index = dispatches.length
        } else {
            index = dispatches[dispatches.length - 1].index + 1
        }
        setDispatches([...dispatches, {
            index: index,
            id: "B" + `${index + 1}`.padStart(3, '0'),
            items: [
                {
                    id: id,
                    name: name,
                    qty: ""
                }
            ]
        }]);
    };

    //Deleting items to the screen
    const deleteItems = (index) => {
        console.log('INDEX IS ---- ', index)
        const filteredList = dispatches.filter((d) => d.index != index);
        for (let i = 0; i < dispatches.length - 1; i++) {
            filteredList[i].index = i;
            filteredList[i].id = "B" + `${i + 1}`.padStart(3, '0')
        }
        setDispatches(filteredList);
    };

    const duplicateItems = (index) => {
        const lastIndex = dispatches[index].items.length;
        const lastId = dispatches[index].items[lastIndex - 1].id;
        const lastName = dispatches[index].items[lastIndex - 1].name;
        const lastQty = dispatches[index].items[lastIndex - 1].qty;

        let filtered = [...dispatches];
        // console.log(filtered[index].items);
        filtered[index].items = [...filtered[index].items,
            {
                id: lastId,
                name: lastName,
                qty: lastQty
            }
        ]
        setDispatches(filtered)
        // console.log(filtered)
    };

    //storing item name on change
    const storeItemName = (item, parentItem, itemName, itemIndex) => {

        // console.log(itemName)
        if ('index' in item) {
            console.log('parent array')
            const currentIndex = dispatches.indexOf(item);
            // const index = testDispatches[currentIndex].items.length-1;
            dispatches[currentIndex].items[0]['name'] = itemName;
            const currentDispatchItemId = categories[itemIndex].id
            dispatches[currentIndex].items[0]['id'] = currentDispatchItemId;
            setSelectedItemValue(selectedItemValue + 1);
            console.log(item)
        } else {
            console.log('child arary')
            const currentParentIndex = dispatches.indexOf(parentItem);
            const currentChildIndex = dispatches[currentParentIndex].items.indexOf(item);
            dispatches[currentParentIndex].items[currentChildIndex].name = itemName;
            const currentDispatchItemId = categories[itemIndex].id
            dispatches[currentParentIndex].items[currentChildIndex].id = currentDispatchItemId;
            setSelectedItemValue(selectedItemValue + 1);
            console.log(currentChildIndex)
        }
    };
    //storing item quantity on change

    const storeItemQuantity = (item, parentItem, value, type) => {

        if ('index' in item) {
            console.log('parent array')
            const currentIndex = dispatches.indexOf(item);
            dispatches[currentIndex].items[0][type] = value;
            setSelectedItemValue(selectedItemValue + 1);


        } else {
            console.log('child array', item)
            const currentParentIndex = dispatches.indexOf(parentItem);
            const currentChildIndex = dispatches[currentParentIndex].items.indexOf(item);
            dispatches[currentParentIndex].items[currentChildIndex][type] = value;
            setSelectedItemValue(selectedItemValue + 1);
            console.log(currentChildIndex)
        }
    };

    const validateDate = () => {
        if (dispatchAt !== null) {
            return true
        }
    };

    const validateQty = () => {
        let qty = true;
        dispatches.forEach((ele) => {
            ele.items.forEach((i) => {
                if (i.qty == "") {
                    qty = false;
                }
            })
        })
        return qty
    };

    // sending inputs to the api on submit
    const onSubmitData = (dispatches) => {
        let isDate = validateDate();
        let isQty = validateQty();
        if (dispatches.length !== 0) {
            if (isDate) {
                if (isQty) {
                    setLoading(true)
                    dispatchData(dispatchAt, dispatches, authToken).then((res) => {
                        console.log(dispatches, dispatchAt)
                        setLoading(false)
                        const {success, message} = res;
                        if (success) {
                            navigation.navigate('TransportDetails', {dispatchId: res.dispatchId, authToken})
                        } else {
                            alert(message)
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    alert('Please enter a quantity')
                }
            } else {
                alert('Please select a date')
            }
        } else {
            alert('Please add an item')
        }
        // console.log(validateQty());
    };
    //
    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // do something
    //         showDatePicker()
    //     });
    //
    //     return unsubscribe;
    // }, [navigation, setDispatchAt]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDispatchAt(moment(date).format('YYYY-MM-DD h:mm:ss'));
        hideDatePicker();
    };

    // const isDupes = [1,2]


    return (
        <>
            {dispatches && console.log(dispatches[0])}
            {loading ?
                <Loading text='Loading, please wait !'/> :
                <View style={styles.container}>
                    <View style={{
                        height: 35,
                        width: '100%',
                        // backgroundColor: '#dddddd',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 2
                    }}>
                        <TouchableOpacity style={{flexDirection: 'row', flex: 3, alignItems: 'center'}}
                                          onPress={() => goBack()}>
                            <Icon name='arrow-back' size={30}/>
                            <Text style={{paddingLeft: 10, fontSize: 18}}>Dispatch Items</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: 35,
                            flex: 2,
                            // width: '100%',
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                            borderRadius: 5,
                            borderColor: '#b9b9b9',
                            borderWidth: 1,
                            padding: 5,
                            backgroundColor: '#000'
                        }} onPress={showDatePicker}>
                            <Icon name='today' size={24} color='#fff'/>
                            <Text style={{
                                color: dispatchAt ? '#fff' : '#b9b9b9',
                                paddingLeft: 10,
                                fontSize: 16
                            }}>{dispatchAt ? moment(dispatchAt).format('DD/MM/YYYY') : ' Select date'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.datePickerView}>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <ScrollView>
                        <FlatList
                            data={dispatches}
                            renderItem={({item}) => {
                                return (
                                    <View style={styles.inputGroup}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', height: 40}}>
                                            <View style={styles.inputId}><Text>{item.id}</Text></View>
                                            <View style={[styles.inputBox, {flex: 5}]}>
                                                <Picker
                                                    mode={'dialog'}
                                                    selectedValue={item.items[0].name}
                                                    style={styles.pickerStyle}
                                                    onValueChange={(itemValue, itemIndex) => {
                                                        storeItemName(item, item, itemValue, itemIndex)
                                                    }}>
                                                    {categories && categories.map((d) => {
                                                        return <Picker.Item key={d.id} label={d.name} value={d.name}/>
                                                    })}
                                                </Picker>
                                            </View>
                                            <View style={[styles.inputBox, {flex: 3}]}>
                                                <TextInput
                                                    style={styles.pickerStyle}
                                                    multiline={false}
                                                    numberOfLines={1}
                                                    maxLength={3}
                                                    placeholder='Quantity'
                                                    keyboardType='numeric'
                                                    onChangeText={qty => {
                                                        storeItemQuantity(item, item, qty, type = 'qty')
                                                    }}
                                                    value={item.items[0].qty}
                                                />
                                            </View>
                                            <TouchableOpacity style={[styles.actionButton, {flex: 1.2}]}
                                                              onPress={() => deleteItems(item.index)}>
                                                <Icon name='delete-forever' size={30} color='red'/>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.actionButton, {flex: 1.2}]}
                                                              onPress={() => duplicateItems(item.index)}>
                                                <Icon name='add-box' size={25} color='green'/>
                                            </TouchableOpacity>
                                        </View>
                                        {item ? item.items.slice(1, item.items.length).map((val) => {
                                            return (
                                                <View style={{flexDirection: 'row', alignItems: 'center', height: 44}}>
                                                    {/* {console.log(val)} */}
                                                    <View style={styles.inputId}><Text></Text></View>
                                                    <View style={[styles.inputBox, {flex: 5}]}>
                                                        <Picker
                                                            mode={'dialog'}
                                                            selectedValue={item.items[dispatches[item.index].items.indexOf(val)].name}
                                                            style={styles.pickerStyle}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                storeItemName(val, item, itemValue, itemIndex)
                                                            }}>
                                                            {categories && categories.map((d) => {
                                                                return <Picker.Item key={d.id} label={d.name}
                                                                                    value={d.name}/>
                                                            })}
                                                        </Picker>

                                                    </View>
                                                    <View style={[styles.inputBox, {flex: 3}]}>
                                                        <TextInput
                                                            style={styles.pickerStyle}
                                                            multiline={false}
                                                            numberOfLines={1}
                                                            maxLength={3}
                                                            placeholder='Quantity'
                                                            keyboardType='numeric'
                                                            onChangeText={qty => {
                                                                storeItemQuantity(val, item, qty, type = 'qty')
                                                            }}
                                                            value={item.items[dispatches[item.index].items.indexOf(val)].qty}
                                                        />
                                                    </View>
                                                    <View style={[styles.actionButton, {flex: 1.2}]}
                                                          onPress={() => deleteItems(item.index)}>
                                                    </View>
                                                    <View style={[styles.actionButton, {flex: 1.2}]}
                                                          onPress={() => duplicateItems(item.index)}>
                                                    </View>
                                                </View>
                                            )
                                        }) : null}

                                    </View>

                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
                    {/*-------------input group-------------*/}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.addNewButton} onPress={addItems}>
                            <Icon name='queue' size={25} color='white'/>
                            <Text style={styles.buttonText}> Add Box</Text>
                        </TouchableOpacity>
                        <View style={{width: '4%'}}/>
                        <TouchableOpacity style={styles.addNewButton} onPress={() => onSubmitData(dispatches)}>
                            <Icon name='playlist-add-check' size={25} color='white'/>
                            <Text style={styles.buttonText}>Proceed</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    scrollView: {
        // paddingHorizontal: 15,
    },
    datePickerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    datePicker: {
        margin: 10,
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: 'green'
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',

    },
    inputGroup: {
        flex: 1,
        marginBottom: 10,
        // height: 400,
        // paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        flexDirection: 'column',
        // justifyContent: 'center',
        backgroundColor: '#eee',
    },
    inputId: {
        flex: 1.3,
    },
    inputBox: {
        alignItems: 'center',
        borderWidth: 1,
        height: 39,
        borderRadius: 5,
        marginLeft: 5,
        borderColor: pickerBorder,
        padding: 1
    },
    pickerStyle: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    actionButton: {
        // marginLeft: 5,
        height: '100%',
        // paddingLeft: 15,
        // paddingVertical: 25,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'pink'
    },
    buttonText: {
        color: '#fff'
    },
    buttonGroup: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addNewButton: {
        flexDirection: 'row',
        height: 40,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        color: '#fff',
        backgroundColor: '#000'
    },
    button: {
        marginBottom: 15,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        color: '#fff'
    }

});

export default DispatchScreen;

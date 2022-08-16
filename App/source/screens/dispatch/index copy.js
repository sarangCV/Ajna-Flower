import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Picker, TextInput, FlatList} from 'react-native';
import {authTokenKey} from '../../configuration';
import {getCategory} from '../../api/category';
import {dispatchData} from '../../api/dispatch';
import {fetchData} from '../../service/AsyncStorage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from "../../components/Loading";
import {pickerBorder} from '../../assets/colors';

moment.locale('en-IN');


const DispatchScreen = ({navigation}) => {
    const [loading, setLoading] = React.useState(true);
    const [dispatchItem, setDispatchItem] = React.useState([]);
    const [dispatches, setDispatches] = React.useState([''])
    const [authToken, setAuthToken] = React.useState([])
    const [selectedItemValue, setSelectedItemValue] = React.useState('');
    const [lastQty, setLastQty] = React.useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dispatchAt, setDispatchAt] = React.useState(null);

    useEffect(() => {
        getDispatchItemList();
    }, [])

    //getting the data
    const getDispatchItemList = async () => {
        fetchData(authTokenKey).then((token) => {
            setAuthToken(token)
            getCategory(token).then((res) => {
                setLoading(false)
                const {success, categoriesList} = res;
                if (success) {
                    setDispatchItem(categoriesList)
                    setDispatches([{
                        index: 0,
                        id: "B" + `${1}`.padStart(3, '0'),
                        item: categoriesList[0].id,
                        name: categoriesList[0].name,
                        qty: ""
                    }])
                } else {
                    alert(res.message)
                }
            })
        })
    }

    //adding items to the screen
    const addItems = () => {
        const {id, name} = dispatchItem[0]
        let index = 0
        if (dispatches == 0) {
            index = dispatches.length
        } else {
            index = dispatches[dispatches.length - 1].index + 1
        }
        setDispatches([...dispatches, {
            index: index,
            id: "B" + `${index + 1}`.padStart(3, '0'),
            item: id,
            name,
            qty: ""
        }]);
    };

    //deleting items to the screen
    const deleteItems = (index) => {
        const filteredList = dispatches.filter((d) => d.index != index);
        for (let i = 0; i < dispatches.length - 1; i++) {
            filteredList[i].index = i;
            filteredList[i].id = "B" + `${i + 1}`.padStart(3, '0')
        }
        setDispatches(filteredList);
    };

    //duplicating items to the screen
    const duplicateItems = (index) => {
        if (dispatches != 0) {
            const lastIndex = dispatches[dispatches.length - 1].index + 1;
            const lastItem = dispatches[index].item;
            const lastQty = dispatches[index].qty;
            const lastName = dispatches[index].name;
            const lastId = "B" + `${lastIndex + 1}`.padStart(3, '0')
            setDispatches([...dispatches, {
                index: lastIndex,
                id: lastId,
                item: lastItem,
                name: lastName,
                qty: lastQty
            }]);
        }
    };

    //storing item name on change
    const storeItemName = (item, itemName, itemIndex) => {
        const currentIndex = dispatches.indexOf(item);
        dispatches[currentIndex].name = itemName;
        const currentDispatchItemId = dispatchItem[itemIndex].id;
        dispatches[currentIndex].item = currentDispatchItemId;
        setSelectedItemValue(selectedItemValue+1);
    };

    const storeItemQuantity = (item, value, type) => {
        const currentIndex = dispatches.indexOf(item);
        dispatches[currentIndex][type] = value;
    };

    const validateDate = () => {
        if (dispatchAt !== null) {
            return true
        }
    };

    const validateQty = () => {
        let qty = true;
        dispatches.forEach((ele) => {
            if (ele.qty == "") {
                qty = false;
            }
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
                    dispatchData(dispatches, dispatchAt, authToken).then((res) => {
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
    };

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

    return (
        <>
        {/* {console.log(selectedItemValue)} */}
            {loading ?
                <Loading text='Loading, please wait !'/> :
                <SafeAreaView style={styles.container}>
                    <View style={styles.datePickerView}>
                        <TouchableOpacity style={{
                            height: 40,
                            width: '100%',
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderRadius: 5,
                            borderColor: '#b9b9b9',
                            borderWidth: 1,
                            padding: 10
                        }} onPress={showDatePicker}>
                            <Icon name='today' size={24} color='gray'/>
                            <Text style={{
                                color: dispatchAt ? 'black' : '#b9b9b9',
                                paddingLeft: 10,
                                fontSize: 16
                            }}>{dispatchAt ? moment(dispatchAt).format('DD/MM/YYYY') : ' Select dispatch date'}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>

                    <FlatList
                        data={dispatches}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.inputGroup}>
                                    <View style={styles.inputId}><Text>{item.id}</Text></View>
                                    <View style={[styles.inputBox, {flex: 5}]}>
                                        <Picker
                                            mode={'dialog'}
                                            selectedValue={item.name}
                                            style={styles.pickerStyle}
                                            onValueChange={(itemValue, itemIndex) => {
                                                storeItemName(item, itemValue, itemIndex)
                                            }}>
                                            {dispatchItem && dispatchItem.map((d) => {
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
                                                setLastQty(qty), storeItemQuantity(item, qty, type = 'qty')
                                            }}
                                            value={item.qty}
                                        />

                                    </View>
                                    <TouchableOpacity style={[styles.actionButton, {flex: 1.2}]}
                                                      onPress={() => deleteItems(item.index)}>
                                        <Icon name='delete-forever' size={30} color='red'/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, {flex: 1.2}]}
                                                      onPress={() => duplicateItems(item.index)}>
                                        <Icon name='content-copy' size={25} color='blue'/>
                                    </TouchableOpacity>
                                </View>

                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    {/*-------------input group-------------*/}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.addNewButton} onPress={addItems}>
                            <Icon name='queue' size={25} color='white'/>
                            <Text style={styles.buttonText}>Add Row</Text>
                        </TouchableOpacity>
                        <View style={{width: '4%'}}/>
                        <TouchableOpacity style={styles.addNewButton} onPress={() => onSubmitData(dispatches)}>
                            <Icon name='playlist-add-check' size={25} color='white'/>
                            <Text style={styles.buttonText}>Proceed</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>}
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
        marginBottom: 10,
        height: 60,
        // paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eeeded',
    },
    inputId: {
        flex: 1.3,
    },
    inputBox: {
        alignItems: 'center',
        borderWidth: 1,
        height: 40,
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

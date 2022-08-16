import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import InputBox from '../../components/dispatch/inputbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {transportData} from '../../api/transport';
import {getDispatchItem} from '../../api/dispatch';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Loading from "../../components/Loading";

const AcceptTransportDetailsScreen = ({route, navigation}) => {
    const [loading, setLoading] = React.useState(true)
    const [transportList, setTransportList] = React.useState([]);
    const [dispatchTimeVisibility, setDispatchTimeVisibility] = useState({visibility: false, currentItem: ''});
    const [arriveTimeVisibility, setArriveTimeVisibility] = useState({visibility: false, currentItem: ''});
    const [vehicleNo, setVehicleNo] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [dispatchTime, setDispatchTime] = useState('');
    const [arriveTime, setArriveTime] = useState('');
    const [note, setNote] = useState('');
    const [authToken, setAuthToken] = useState('');
    const [dispatchId, setDispatchId] = useState('');
    const [selectedBoxes, setSelectedBoxes] = useState([]);
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        getTransportItemList();
    }, []);


    const getTransportItemList = async () => {
        // const dispatchId = 485
        // const authToken = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUxMiwiYWNjZXNzTGV2ZWwiOiJzdXBlci1hZG1pbiIsImlhdCI6MTYwMDkyNjM5NSwiZXhwIjoxNjMyNDYyMzk1LCJhdWQiOiJodHRwOi8vcHJhc2hhbnQud29yay8iLCJpc3MiOiJQcmFzaGFudCBHYXVyYXYiLCJzdWIiOiJwZ2RldjI1QGdtYWlsLmNvbSJ9.Z-PqGc7Z_G2jy5VWzZ0mLC9Vzp9hVS6Poa6ChnNpeaAGgpzRaO0bRV0kKvEA4PgaWM7fE1yd7o983WbRJu-4AkNieDXMSreURJNMydbPT2bFTeOCd_K7bZLYocYhbI3VfEm2qsFlUdatnk1ZcpUobw4TeMYpy7P279vhdWyYxu1CSCRSB4XE7Zv1Rpt4RKd-4wJwt2SNYPDSHE0Q8c3G6A0MHwGX1ZBKz46D_pWh7A-uTH3ZPmyriOLY4T0KBU5PmHoC4RhUp1QwecUQ6ixCKniyrQufNXH7Kx3oI-v5A7zjqu1NaRThDLTFUtNPZIbuiwoA4NMHbG0OhjqVo5n280PLWIWXfy42SnfheTZSdgnb1HOj8gx4Dj9Yzzr88dpe2ygJLjXZjntgslVPO-BqnwcQlPJXItPaJvVthseXbohNPoMJjE6aSLMMtz5lGubclCkhwOj1lKKdk5qNlnqS61KP2Nbi_CClLQwcpjEot9FJVKHNaudS3hdDO2L1h6kdvhcgL50nshbkOGzbXAl3sWxwfHTaEK0BKKpjBj2CrQK0AtHQmkzMcK9asS1-I-UWffaIscCdpF29hP3qnqA3s0Y60uKZhKCji6nljBEEa_43NGXtxzjGlssEwMmzmcYyA_0jhUqYkpuaN1bPxspDNy14sfdpD01O3Hm3FbqvUh4'
        const {dispatchId, authToken} = route.params;
        setDispatchId(dispatchId);
        setAuthToken(authToken);
        await getDispatchItem(dispatchId, authToken).then((res) => {
            setLoading(false)
            const {success, clientsList} = res;
            if (success) {
                let boxesArr = [];
                clientsList.forEach(element => {
                    let items = [];
                    element.items.forEach((i) => {
                        items = [...items, i]
                    })
                    boxesArr = [...boxesArr, {name: items, id: element.id}]
                });
                setBoxes(boxesArr)
            }
        })
        setTransportList([
            {
                index: 0,
                dispatchId: dispatchId,
                vehicleNo: vehicleNo,
                vehicleType: vehicleType,
                contactPerson: contactPerson,
                contactNumber: contactNumber,
                dispatchTime: dispatchTime,
                arriveTime: arriveTime,
                note: note,
                boxes: selectedBoxes
            }
        ])

    };

    // date picker handler
    const showDispatchTimePicker = (item) => {
        setDispatchTimeVisibility({visibility: true, currentItem: item});
    };

    const showArriveTimePicker = (item) => {
        setArriveTimeVisibility({visibility: true, currentItem: item});
    };

    const hideDatePicker = () => {
        setArriveTimeVisibility({visibility: false, currentItem: ''});
        setDispatchTimeVisibility({visibility: false, currentItem: ''});
    };

    const handleDispatchConfirm = (datetime) => {
        const currentItemIndex = transportList.indexOf(dispatchTimeVisibility.currentItem);
        transportList[currentItemIndex].dispatchTime = datetime;
        hideDatePicker();
    };

    const handleArrivalConfirm = (datetime) => {
        const currentItemIndex = transportList.indexOf(arriveTimeVisibility.currentItem);
        transportList[currentItemIndex].arriveTime = datetime;
        hideDatePicker();
    };

    // adding items to the screen
    const addItems = () => {
        let index = 0

        if (transportList == 0) {
            index = transportList.length
        } else {
            index = transportList[transportList.length - 1].index + 1
        }
        setTransportList(
            [...transportList, {
                index: index,
                dispatchId: dispatchId,
                vehicleNo: '',
                vehicleType: '',
                contactPerson: '',
                contactNumber: '',
                dispatchTime: '',
                arriveTime: '',
                note: '',
                boxes: []
            }]
        );
        setDispatchTimeVisibility({visibility: false, currentItem: ''});
        setArriveTimeVisibility({visibility: false, currentItem: ''})

    };

    //deleting items to the screen
    const deleteItems = (index) => {
        const filteredList = transportList.filter((d) => d.index != index);
        for (let i = 0; i < transportList.length - 1; i++) {
            filteredList[i].index = i;
        }
        setTransportList(filteredList);
    };

    const storeValue = (item, value, type) => {
        console.log('MULTI SELECT DATA ::----::', value)
        const currentIndex = transportList.indexOf(item);
        transportList[currentIndex][type] = value;
    };

    const validateVehicleNumber = () => {
        const pattern = /[A-Z]{2}\/[0-9]{2}\/[A-Z]{2}\/\d{4}$/i;
        let isVehicleNumber = true;
        transportList.forEach((e) => {
            if (pattern.test(e.vehicleNo) !== true) {
                isVehicleNumber = false;
            }
        })
        return isVehicleNumber;

        // str = "MH/14/AA/2000";
    };

    const validateMobile = () => {
        const pattern = /^[0]?[789]\d{9}$/;
        let isContactNumber = true;
        transportList.forEach((e) => {
            if (pattern.test(e.contactNumber) !== true) {
                isContactNumber = false;
            }
        })
        return isContactNumber;
    };

    const validateItems = () => {
        let isBoxes = true;
        transportList.forEach((e) => {
            if (e.boxes.length == 0) {
                isBoxes = false;
            }
        })
        return isBoxes;
    };
    // Full validation
    // const submitData = (transportList) => {
    //     console.log(transportList)

    //     if (transportList.length !== 0) {
    //         // if (transportList.some(ele => Object.values(ele).some(e => e === '')) !== true) {
    //         if (validateItems()) {
    //             if(contactPerson !== '') {
    //                     if (validateMobile()) {
    //                         if (validateVehicleNumber()) {
    //                                 setLoading(transportList)
    //                                 transportData(transportList, authToken).then((res) => {
    //                                     setLoading(false)
    //                                     const {message, success} = res
    //                                     alert(res.message)
    //                                     if (success) {
    //                                         navigation.navigate('Home')
    //                                     }

    //                                 }).catch((error) => {
    //                                     alert(error)
    //                                 })
    //                         } else {
    //                             alert('please enter a valid vehicle number ie: TN/14/AA/2000')
    //                         }

    //                     } else {
    //                         alert('enter a mobile number')
    //                     }


    //             } else {
    //                 alert('please provide contact name')
    //             }
    //         } else {
    //             alert('please select items')
    //         }
    //         // } else {
    //         //     alert('please enter all the details')
    //         // }
    //     } else {
    //         alert('Please add an item')
    //     }
    //     //    console.log(validateMobile())
    // };


    // Checking if values are not null 
    const submitData = (transportList) => {
        console.log(transportList)

        if (transportList.length !== 0) {
            // if (transportList.some(ele => Object.values(ele).some(e => e === '')) !== true) {
            if (validateItems()) {
                if(contactPerson !== '') {
                        if (contactNumber !== '') {
                            if (vehicleNo !== '') {
                                    setLoading(transportList)
                                    transportData(transportList, authToken).then((res) => {
                                        setLoading(false)
                                        const {message, success} = res
                                        alert(res.message)
                                        if (success) {
                                            navigation.navigate('Home')
                                        }

                                    }).catch((error) => {
                                        alert(error)
                                    })
                            } else {
                                alert('please enter a vehicle number')
                            }

                        } else {
                            alert('enter a mobile number')
                        }


                } else {
                    alert('please provide contact name')
                }
            } else {
                alert('please select items')
            }
            // } else {
            //     alert('please enter all the details')
            // }
        } else {
            alert('Please add an item')
        }
        //    console.log(validateMobile())
    };

    return (
        <>

            <DateTimePickerModal
                isVisible={dispatchTimeVisibility.visibility}
                mode={'datetime'}
                onConfirm={handleDispatchConfirm}
                onCancel={hideDatePicker}/>
            <DateTimePickerModal
                isVisible={arriveTimeVisibility.visibility}
                mode={'datetime'}
                onConfirm={handleArrivalConfirm}
                onCancel={hideDatePicker}/>
            <View style={styles.container}>
                {loading ? <Loading text='Please wait..!'/> :
                    <FlatList
                        data={transportList}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.inputGroup}>
                                    <View style={styles.idBox}>
                                        <View style={{alignItem: 'center', justifyContent: 'center'}}>
                                            <Text>D-id: {item.dispatchId}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.smallButton, {backgroundColor: '#ff006f'}]}
                                            onPress={() => deleteItems(item.index)}>
                                            <Text style={styles.buttonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{
                                        backgroundColor: '#fff',
                                        height: item.boxes.length !== 0 ? null : 45,
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: '#c6c6c6',
                                        width: '100%',
                                        marginVertical: 5
                                    }}>
                                        <SectionedMultiSelect
                                            // styles={{container: {height:300 }}}
                                            items={boxes}
                                            uniqueKey="id"
                                            selectText="select items"
                                            onSelectedItemsChange={(value) => {
                                                setSelectedBoxes(value), storeValue(item, value, type = 'boxes')
                                            }}
                                            selectedItems={item.boxes}
                                            hideSearch={true}
                                        />
                                    </View>

                                    <InputBox
                                        size={{width: '100%', height: 40}}
                                        text='Contact person / Driver name'
                                        onChangeText={(value) => {
                                            setContactPerson(value), storeValue(item, value, type = 'contactPerson')
                                        }}
                                        value={item.contactPerson}
                                    />
                                    <InputBox
                                        size={{width: '100%', height: 40}}
                                        text='Contact Number'
                                        onChangeText={(value) => {
                                            setContactNumber(value), storeValue(item, value, type = 'contactNumber')
                                        }}
                                        value={item.contactNumber}
                                        textContentType='telephoneNumber'
                                        keyboardType='numeric'
                                        maxLength={10}
                                    />
                                    <View style={styles.contactPersonBox}>
                                        <InputBox
                                            size={{width: '49%', height: 40}}
                                            text='Vehicle No'
                                            onChangeText={(value) => {
                                                setVehicleNo(value), storeValue(item, value, type = 'vehicleNo')
                                            }}
                                            value={item.vehicleNo}
                                        />
                                        <InputBox
                                            size={{width: '49%', height: 40}}
                                            text='Vehicle Type'
                                            onChangeText={(value) => {
                                                setVehicleType(value), storeValue(item, value, type = 'vehicleType')
                                            }}
                                            value={item.vehicleType}
                                        />
                                    </View>
                                    {/* <View style={styles.datePickerBox}>*/}
                                    {/*    <TouchableOpacity onPress={() => {*/}
                                    {/*        showDispatchTimePicker(item)*/}
                                    {/*    }} style={styles.datePickerButton}>*/}
                                    {/*        <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                                    {/*            <Icon name='today' size={20} color='gray'/>*/}
                                    {/*            <View style={{width: 160, height: 50, justifyContent: 'center'}}>*/}
                                    {/*                <Text*/}
                                    {/*                    style={{color: item.dispatchTime ? 'black' : '#aaaaaa'}}>{item.dispatchTime ? moment(item.dispatchTime).format('DD/MM/YY h:mm a') : 'Dispatch Time'}</Text>*/}
                                    {/*            </View>*/}
                                    {/*        </View>*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*    <TouchableOpacity onPress={() => {*/}
                                    {/*        showArriveTimePicker(item)*/}
                                    {/*    }} style={[styles.datePickerButton, {marginLeft: 6}]}>*/}
                                    {/*        <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                                    {/*            <Icon name='today' size={20} color='gray'/>*/}
                                    {/*            <View style={{width: 160, height: 50, justifyContent: 'center'}}>*/}
                                    {/*                <Text*/}
                                    {/*                    style={{color: item.arriveTime ? 'black' : '#aaaaaa'}}>{item.arriveTime ? moment(item.arriveTime).format('DD/MM/YY h:mm a') : 'Arrival Time'}</Text>*/}
                                    {/*            </View>*/}
                                    {/*        </View>*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*</View> */}
                                    <InputBox
                                        size={{width: '100%', height: 40}}
                                        text='Note/ additional details'
                                        onChangeText={(value) => {
                                            setNote(value), storeValue(item, value, type = 'note')
                                        }}
                                        value={item.note}
                                    />
                                </View>
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={[styles.addNewButton, {backgroundColor: '#ff0047', width: '31%',}]} onPress={()=>navigation.navigate('Home')}>
                        <Text style={styles.buttonText}>Skip</Text>
                    </TouchableOpacity>
                    <View style={{width: '2%'}}/>
                    <TouchableOpacity style={[styles.addNewButton, {backgroundColor: '#05a169', width: '31%',}]} onPress={addItems}>
                        <Text style={styles.buttonText}>Add New</Text>
                    </TouchableOpacity>
                    <View style={{width: '2%'}}/>
                    <TouchableOpacity style={[styles.addNewButton, {backgroundColor: '#9500ff', width: '31%',}]} onPress={() => {submitData(transportList)}}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e3e3',
        padding: 10,
    },
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
    contactPersonBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    InputBox: {
        marginVertical: 5,
        width: '100%',
        borderWidth: 1
    },
    datePickerBox: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        // alignItems: 'center'
    },
    datePickerButton: {
        // justifyContent: 'flex-start',
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderColor: '#a2a2a2',
        borderRadius: 5,
        marginVertical: 5,
        paddingLeft: 6,
        // height: 35,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    buttonGroup: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallButton: {
        height: 30,
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        color: '#fff',
    },
    addNewButton: {
        marginBottom: 15,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        color: '#fff'
    },
    buttonText: {
        color: '#fff',
    },
});

export default AcceptTransportDetailsScreen;

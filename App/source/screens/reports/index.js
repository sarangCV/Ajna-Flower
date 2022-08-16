import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraRoll from "@react-native-community/cameraroll";
import {  } from "react-native";
import { authTokenKey } from '../../configuration';
import { getClientsList } from '../../api/clients';
import { fetchData } from '../../service/AsyncStorage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { submitReport } from '../../api/reports';

const Reports = ({navigation}) => {

    const [loading, setLoading] = React.useState(false);
    const [authToken, setAuthToken] = React.useState(null);
    
    const [selectedClientName, setSelectedClientName] = React.useState(null);
    const [clientsList, setClientsList] = React.useState([]);
    const [startDateVisibility, setStartDateVisibility] = React.useState( false);
    const [endDateVisibility, setEndDateVisibility] = React.useState(false);
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);


    
    React.useEffect(() => {
        getItems();
    }, [])

    const getItems = async () => {
        await fetchData(authTokenKey).then(async (token) => {
            setAuthToken(token)
            await getClientsList(token).then((res) => {
                const {success, clientsList} = res;
                if (success) {
                    setClientsList(clientsList);
                    setSelectedClientName(clientsList[0].id)
                } else {
                    console.error(res.message)
                }
            })
            console.log(clientsList)
        })
    };

    const showStartDate = () => {
        setStartDateVisibility(true);
    };

    const handleStartDate = (datetime) => {
        setStartDate(datetime)
        hideDatePicker();
    };
    const handleEndDate = (datetime) => {
        setEndDate(datetime)
        hideDatePicker();
    };

    const showEndDate = () => {
        setEndDateVisibility(true);
    };

    const hideDatePicker = () => {
        setStartDateVisibility(false);
        setEndDateVisibility(false)
    };
    
    // On submit data
    const onSubmit = () => {
        let dateFrom = moment(startDate).format('YYYY-MM-DD 0:0:00.000000');
        let dateTo = moment(endDate).format('YYYY-MM-DD 0:0:00.000000');
       submitReport(dateFrom, dateTo, selectedClientName, authToken)
       .then((res) => {
           const {success, message, data} = res;
           if(success) {
            //    alert('Reports submitted.')
            navigation.navigate('ViewReports', data)
           } else {
              alert(message)
           }
       })
    }

    return (
        <View style={styles.container}>
            <DateTimePickerModal
                isVisible={startDateVisibility}
                mode={'date'}
                onConfirm={handleStartDate}
                onCancel={hideDatePicker}/>
            <DateTimePickerModal
                isVisible={endDateVisibility}
                mode={'date'}
                onConfirm={handleEndDate}
                onCancel={hideDatePicker}/>

            <View style={{ borderRadius: 5, padding: 5, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 45, justifyContent: 'space-between', marginBottom: 0, padding: 5, }}>
                    <TouchableOpacity style={
                        { 
                            width: '49%', 
                            borderWidth: 0.3, 
                            paddingHorizontal: 10, 
                            borderRadius: 5, 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }
                        }
                        onPress={showStartDate}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name='today' size={20} color='gray'/>
                            <View style={{flex: 1, marginLeft: 2}}>
                                <Text style={{color: startDate ? 'black' : '#aaa'}}>{startDate ? moment(startDate).format('DD/MM/YYYY') : 'Select a starting date'}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={
                        { 
                            width: '49%', 
                            borderWidth: 0.3, 
                            paddingHorizontal: 10, 
                            borderRadius: 5, 
                            alignItems: 'center', 
                            justifyContent: 'center'
                         }
                        }
                        onPress={showEndDate}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name='today' size={20} color='gray'/>
                            <View style={{flex: 1, marginLeft: 2}}>
                                <Text style={{color: endDate ? 'black' : '#aaa'}}>{endDate ? moment(endDate).format('DD/MM/YYYY') : 'Select a end date'}</Text>
                            </View>
                        </View>                    
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: '#fff', height: 50, justifyContent: 'center', padding: 5 }}>
                    <View style={{ flexDirection: 'row', borderWidth: 0.3, flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1,}}>
                            <Text>Client name</Text>
                        </View>
                        <View style={{ flex: 1,}}>
                            <Picker mode='dialog' selectedValue={selectedClientName} style={styles.pickerStyle}
                                onValueChange={(itemValue) => setSelectedClientName(itemValue)}>
                                <Picker.Item key={'null'} label={'All'} value={null}/>
                                {clientsList && clientsList.map((item) =>
                                <Picker.Item key={item.id} label={item.name} value={item.id}/>)}
                            </Picker>
                        </View>
                    </View>
                    
                </View>
            </View>
                

            <View style={styles.addBoxView}>
                <TouchableOpacity style={styles.filterButton} onPress={onSubmit}>
                    <Text style={{ color: '#fff' }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
    filterButton: {
        flex: 1,
        minHeight: 40,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:5
    },
});

export default Reports

import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraRoll from "@react-native-community/cameraroll";
import {  } from "react-native";

const Expenses = () => {

    const [loading, setLoading] = React.useState(false);
    const [authToken, setAuthToken] = React.useState(null);
    const [title, setTitle] = React.useState(null);
    const [details, setDetails] = React.useState(null);
    const [amount, setAmount] = React.useState(null);
    const [photo, setPhoto] = React.useState(null);
    
    React.useEffect(() => {
        async function hasAndroidPermission() {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
           
            const hasPermission = await PermissionsAndroid.check(permission);
            if (hasPermission) {
              return true;
            }
           
            const status = await PermissionsAndroid.request(permission);
            return status === 'granted';
          }
           
          async function savePicture() {
            if (Platform.OS === "android" && !(await hasAndroidPermission())) {
              return;
            }
           
            // CameraRoll.save(tag, { type, album })
          };
    }, [])

    

    _handleButtonPress = () => {
        console.log('Picking photo..')
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
          })
          .then(r => {
            setPhoto({ photos: r.edges });
          })
          .catch((err) => {
             //Error Loading Images
          });
        };

   

    // On submit data
    const onSubmit = () => {
       console.log(title, details, amount)
    }

    return (
        <View style={styles.container}>
            <View style={{ borderRadius: 5, padding: 5, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', marginBottom: 0, padding: 5, }}>
                    <View style={{ flex: 2, }}>
                        <Text>Title</Text>
                    </View>
                    <View style={{ flex: 3, borderWidth: 0.3, paddingHorizontal: 10, borderRadius: 5 }}>
                        <TextInput style={{ width: '100%', height: '100%' }} placeholder="Item Name(ie: PLG)" onChangeText={(text) => setTitle(text)}/>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', padding: 5, }}>
                    <View style={{ flex: 2,}}>
                        <Text>Details</Text>
                    </View>
                    <View style={{ flex: 3, borderWidth: 0.3, paddingHorizontal: 10, borderRadius: 5  }}>
                        <TextInput style={{ width: '100%', height: '100%' }} placeholder="Enter details" onChangeText={(text) => setDetails(text)}/>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', padding: 5 }}>
                    <View style={{ flex: 2 }}>
                        <Text>Amount</Text>
                    </View>
                    <View style={{ flex: 3, borderWidth: 0.3, paddingHorizontal: 10, borderRadius: 5  }}>
                        <TextInput style={{ width: '100%', height: '100%' }} keyboardType="numeric" placeholder="Enter amount" onChangeText={(text) => setAmount(text)}/>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', padding: 5 }}>
                    <View style={{ flex: 2 }}>
                        <Text>Receipt</Text>
                    </View>
                    <View style={{ flex: 3, paddingHorizontal: 10 }}>
                        {/* <TextInput style={{ width: '100%', height: '100%' }} keyboardType="numeric" placeholder="Quantity per bunch" onChangeText={(text) => setDetails(text)}/> */}
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={_handleButtonPress}>
                            <Icon name='add-a-photo' size={24}/>
                            <Text style={{ marginLeft: 10 }}>Choose from gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
                

            <View style={styles.addBoxView}>
                <TouchableOpacity style={styles.filterButton} onPress={() => onSubmit()}>
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

export default Expenses

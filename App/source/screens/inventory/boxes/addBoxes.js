import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native'
import { addBoxes } from '../../../api/boxes';
import Loading from '../../../components/Loading';

const addBoxesScreen = ({navigation, route}) => {

    const [loading, setLoading] = React.useState(false);
    const [boxes, setBoxes] = React.useState(null);
    const [boxName, setBoxName] = React.useState(null);
    const [boxQuantity, setBoxQuantity] = React.useState(null);
    const [authToken, setAuthToken] = React.useState(null);


    React.useEffect(()=> {
        const {authToken} = route.params;
        setAuthToken(authToken)
    }, []);

    const onSubmit = () => {
        if(boxQuantity) {
            setLoading(true)
            addBoxes(authToken, boxName, boxQuantity).then((res) => {
                const {success, message} = res;
                Alert.alert(
                    'Boxes added successfully..!', 'Press okay to go to box list.',
                    [
                        {
                            text: "Okay",
                            onPress: () => navigation.navigate('Boxes'),
                            style: "cancel"
                        },
                    ],
                    {cancelable: false}
                );
            })
        } else {
            alert('Please enter a quantity');
        }
    }


    return (
        <>
        {loading ? <Loading text='Assigning box data...'/> : (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', marginBottom: 15, padding: 5, borderRadius: 5 }}>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text>Enter a box name</Text>
                    </View>
                    <View style={{ flex: 1, borderWidth: 0.5 }}>
                        <TextInput style={{ width: '100%', height: '100%' }}onChangeText={(text) => setBoxName(text)}/>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', marginBottom: 15, padding: 5, borderRadius: 5 }}>
                    <Text style={{ flex: 1, marginLeft: 10 }}>Enter Quantity</Text>
                    <View style={{ flex: 1, borderWidth: 0.5, }}>
                        <TextInput style={{ width: '100%', height: '100%' }} keyboardType="numeric" onChangeText={(text) => setBoxQuantity(text)}/>
                    </View>
                </View>
                
                <View style={styles.addBoxView}>
                    <TouchableOpacity style={styles.filterButton} onPress={() => onSubmit()}>
                        <Text style={{ color: '#fff' }}>Add Box</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}
        </>
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
        justifyContent: 'center'
    },
    fabButton: { 
        height: 65, 
        width: 65, 
        borderRadius: 100, 
        backgroundColor: '#000', 
        position: 'absolute', 
        bottom: 30, 
        right: 15, 
        alignItems: 'center', 
        justifyContent: 'center' 
    }
});

export default addBoxesScreen

import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { addItems } from '../../../api/category';

const AddItems = ({navigation, route}) => {

    const [loading, setLoading] = React.useState(false);
    const [quantity, setQuantity] = React.useState(null);
    const [authToken, setAuthToken] = React.useState(null);
    const [categoryName, setCategoryName] = React.useState(null);


    React.useEffect(()=> {
        const {authToken} = route.params;
        setAuthToken(authToken)
    }, []);

    const onSubmit = () => {
        if(quantity) {
            setLoading(true)
            addItems(authToken, categoryName, quantity).then((res) => {
                const {success, message} = res;
                console.log(message)
                Alert.alert(
                    'Boxes added successfully..!', 'Press okay to View Items.',
                    [
                        {
                            text: "Okay",
                            onPress: () => navigation.navigate('Items'),
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
        <View style={styles.container}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', marginBottom: 15, padding: 5, borderRadius: 5 }}>
                    <View style={{ flex: 2, marginLeft: 10 }}>
                        <Text>Enter Item name</Text>
                    </View>
                    <View style={{ flex: 3, borderWidth: 0.5, paddingHorizontal: 10 }}>
                        <TextInput style={{ width: '100%', height: '100%' }} placeholder="Item Name(ie: PLG)" onChangeText={(text) => setCategoryName(text)}/>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 50, alignItems: 'center', marginBottom: 15, padding: 5, borderRadius: 5 }}>
                    <View style={{ flex: 2, marginLeft: 10 }}>
                        <Text>Enter quantity</Text>
                    </View>
                    <View style={{ flex: 3, borderWidth: 0.5, paddingHorizontal: 10 }}>
                        <TextInput style={{ width: '100%', height: '100%' }} keyboardType="numeric" placeholder="Quantity per bunch" onChangeText={(text) => setQuantity(text)}/>
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

export default AddItems

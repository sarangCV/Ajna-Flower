import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { getCategory, deleteItem } from '../../../api/category';
import InputBox from '../../../components/dispatch/inputbox';
import Loading from '../../../components/Loading';
import { authTokenKey } from '../../../configuration';
import { fetchData } from '../../../service/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ItemDetails = ({navigation, route}) => {

    const [loading, setLoading] = React.useState(true);
    const [authToken, setAuthToken] = React.useState(null);
    const [items, setItems] = React.useState(null);



    React.useEffect(()=> {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData(authTokenKey).then((token) => {
                setAuthToken(token)
                getItemsList(token)
            })
        });
        return unsubscribe;

    }, [navigation]);

    const getItemsList = (token) => {
        getCategory(token).then((res) => {
            console.log('on focus working..')
            const {success, categoriesList} = res;
            if(success) {
                setItems(categoriesList);
                setLoading(false);
            }
        });
    };

    const onDelete = (id) => {
        Alert.alert(
            'You really want to delete this..?', 'Press Yes to continue.',
            [
                {
                    text: "Yes",
                    onPress: () => deleteBoxItem(id),
                    style: "cancel"
                },
                {
                    text: "No",
                    onPress: () => console.log('No selected'),
                    style: "cancel"
                },
            ],
            {cancelable: false}
        );
    };

    const deleteBoxItem = (id) => {
        setLoading(true)
        deleteItem(authToken, id).then((res) => {
            const {success, message} = res;
            if(success) {
                getItemsList(authToken)
            }
        })
    };


    const boxItem = ({item}) => {
        console.log(item)
        const {id, name} = item;
        return(
            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, marginBottom: 10, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', marginRight: 20, flexDirection: 'row' }}>
                    <Text style={{color: '#fff', fontSize: 20}}>{id}</Text>
                </View>
                <View>
                    <Text>Item Name : {name}</Text>
                </View>
                <TouchableOpacity style={{ position: 'absolute', right: 15 }} onPress={() => onDelete(id)}>
                    <Icon name='delete' color='black' size={25}/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <View style={styles.container}>
                {loading ? <Loading text='Loading data...'/> : (
                    <View style={{ flex: 1 }}>
                        <FlatList data={items} renderItem={boxItem} keyExtractor={(item, index) => index.toString()}/>
                        <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate('AddItems', {authToken: authToken})}>
                            <Icon name='add' size={40} color='#fff'/>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </>

    )
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ececec',
        padding: 15,
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

export default ItemDetails

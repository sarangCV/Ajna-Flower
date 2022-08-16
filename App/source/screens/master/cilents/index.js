import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { getClientsList, delteClients } from '../../../api/clients';
import InputBox from '../../../components/dispatch/inputbox';
import Loading from '../../../components/Loading';
import { authTokenKey } from '../../../configuration';
import { fetchData } from '../../../service/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Clients = ({navigation, route}) => {

    const [loading, setLoading] = React.useState(true);
    const [authToken, setAuthToken] = React.useState(null);
    const [clients, setClients] = React.useState(null);


    React.useEffect(()=> {
        const unsubscribe = navigation.addListener('focus', () => {
            // fetchData(authTokenKey).then((token) => {
            //     setAuthToken(token);
            //     getClientsList(token).then((res) => {
            //         const {success, clientsList} = res;
            //         if(success) {
            //             setClients(clientsList)
            //             console.log(clientsList)
            //         }
            //     })
            // })
            fetchData(authTokenKey).then((token) => {
                setAuthToken(token)
                getClients(token)
            })
        });
        return unsubscribe;

    }, [navigation]);


    const getClients = (token) => {
        getClientsList(token).then((res) => {
            // console.log('on focus working..')
            const {success, clientsList} = res;
            if(success) {
                setClients(clientsList);
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
        delteClients(authToken, id).then((res) => {
            const {success, message} = res;
            if(success) {
                getClients(authToken)
            }
        })
    };

    const boxItem = ({item}) => {
        const {id, name, sn} = item;
        return(
            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, marginBottom: 10, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 20, marginRight: 5}}>{id}</Text>
                </View>
                <View>
                    <Text style={{ marginRight: 10 }}>Name : {name}</Text>
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
                        <FlatList data={clients} renderItem={boxItem} keyExtractor={(item, index) => index.toString()}/>
                        <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate('AddClients', {authToken: authToken})}>
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
        padding: 15
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

export default Clients

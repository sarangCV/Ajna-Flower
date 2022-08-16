import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { getBoxes } from '../../../api/boxes';
import Loading from '../../../components/Loading';
import { authTokenKey } from '../../../configuration';
import { fetchData } from '../../../service/AsyncStorage';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

moment.locale('en-IN');


const Boxes = ({navigation}) => {

    const [loading, setLoading] = React.useState(true);
    const [boxes, setBoxes] = React.useState(null);
    const [filteredBoxes, setFilteredBoxes] = React.useState(null);
    const [isBoxAdded, setIsBoxAdded] = React.useState(true);
    const [authToken, setAuthToken] = React.useState(null);

    React.useEffect(()=> {
        const unsubscribe = navigation.addListener('focus', () => {
            getBoxesList()
        });
        return unsubscribe;
    }, [navigation]);

    const getBoxesList = () => {
        fetchData(authTokenKey).then((token) => {
            setAuthToken(token)
            getBoxes(token).then( async (res) => {
                const {success, data} = res;
                if(success) {
                    console.log(data)
                    await setBoxes(data);
                    filterBox(data, isBoxAdded);
                }
            })
        })
    };

    const filterBox = async (data, isBoxAdded) => {
        let filtered = [];
        data.forEach(element => {
            if(element.added == isBoxAdded) {
                filtered = [...filtered, element]
            }
        });
        await setFilteredBoxes(filtered)
        await setLoading(false);
        console.log('filtered::---::', filtered)
    };

    const toggleFilter = (status) => {
        if(!isBoxAdded == status) {
            setLoading(true);
            setIsBoxAdded(status)
            filterBox(boxes, status)
        }
    };

    const boxItem = ({item}) => {
        const {date, added} = item;
        return(
            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, marginBottom: 10, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: added ? 'green' : 'black', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                    <Text style={{ color: '#fff', }}>{moment(date).format('Do')}</Text>
                    <Text style={{color: '#fff', fontSize: 11}}>{moment(date).format('MMMM')}</Text>
                </View>
                <View>
                    <Text>Quantity : {item.qty}</Text>
                </View>
            </View>
        )
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.filterView}>
                    <TouchableOpacity style={[styles.filterButton, {backgroundColor: isBoxAdded ? '#000' : '#fff'}]} onPress={() => toggleFilter(true)}>
                        <Text style={{ color: isBoxAdded ? '#fff' : '#000' }}>Added</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, {backgroundColor: isBoxAdded ? '#fff' : '#000'}]} onPress={() => toggleFilter(false)}>
                        <Text style={{ color: isBoxAdded ? '#000' : '#fff' }}>Not added</Text>
                    </TouchableOpacity>
                </View>
                {loading ? <Loading text='Loading box data...'/> : (
                    <View style={{ flex: 1 }}>
                        <FlatList data={filteredBoxes} renderItem={boxItem} keyExtractor={(item, index) => index.toString()}/>
                        <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate('AddBoxes', {authToken: authToken})}>
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
    filterView: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 15,
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

export default Boxes

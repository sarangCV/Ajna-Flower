import AsyncStorage from '@react-native-community/async-storage';

// storing data to local storage
export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
      } catch (e) {
        console.warn('Failed to save the data to the storage', e)
        return e;
      }
};

// fetching data from local storage
export const fetchData = async(key) => {
  try {
    let value = await AsyncStorage.getItem(key)
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.warn('Failed to save the data to the storage', e)
  }
};

// clearing data from local storage
export const clearData = async () => {
  try {
    await AsyncStorage.clear()
    return true;
  } catch (e) {
    
  }
};
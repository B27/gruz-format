import axios from 'axios';
import { AsyncStorage } from 'react-native';

async function getDispatcher(id) {
    let response;
    try {
        response = await axios.get(`/dispatcher/${id}`);
        console.log('getDispatcher response.data: ', response.data);
    } catch (error) {
        console.log('Error in getDispatcher:', error);
        throw Error(error.message);
    }

    return response;
}

async function startOrder(id) {
    try {
        const userId = await AsyncStorage.getItem('userId');
        let response = await axios.patch(`/order/workers/${id}/${userId}`);
        console.log('startOrder response.status:', response.status);
    } catch (error) {
        console.log('Error in startOrder:', error);
        throw Error(error.message);
    }
}

async function cancelOrder() {
    try {
        let response = await axios.post(`/order/cancel_work`);
        console.log('cancelOrder response.status:', response.status);
    } catch (error) {
        console.log('Error in cancelOrder:', error.response.status, error.response.data.message);
        throw Error(error.message);
    }
}

async function getOrder(id) {
    let response;
    try {
        response = await axios.get(`/order/${id}`);
        //console.log('getOrder response.data:', response.data);
    } catch (error) {
        console.log('Error in getOrder:', error);
        throw Error(error.message);
    }

    return response;
}

export default { cancelOrder, getDispatcher, startOrder, getOrder };

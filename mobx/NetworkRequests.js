import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const TAG = '~NetworkRequest.js~';

async function getDispatcher(id) {
    let response;
    try {
        response = await axios.get(`/dispatcher/${id}`);
        console.log(TAG, 'getDispatcher response.data: ', response.data);
    } catch (error) {
        if (error.response) {
            console.log(TAG, 'Error in getDispatcher:', error.response.status, error.response.data.message);
        } else {
            console.log(TAG, 'Error in getDispatcher:', error);
        }
        throw error;
    }

    return response;
}

async function startOrder(id) {
    try {
        const userId = await AsyncStorage.getItem('userId');
        let response = await axios.patch(`/order/workers/${id}/${userId}`);
        console.log(TAG, 'startOrder response.status:', response.status, response.data.msg);
    } catch (error) {
        if (error.response) {
            console.log(TAG, 'Error in startOrder:', error.response.status, error.response.data.message);
        } else {
            console.log(TAG, 'Error in startOrder:', error);
        }
        throw error;
    }
}

async function cancelOrder() {
    try {
        let response = await axios.post(`/order/cancel_work`);
        console.log(TAG, 'cancelOrder response.status:', response.status);
    } catch (error) {
        if (error.response) {
            console.log(TAG, 'Error in cancelOrder:', error.response.status, error.response.data.message);
        } else {
            console.log(TAG, 'Error in cancelOrder:', error);
        }
        throw error;
    }
}

async function getOrder(id) {
    let response;
    try {
        response = await axios.get(`/order/${id}`);
        //console.log(TAG, 'getOrder response.data:', response.data);
    } catch (error) {
        if (error.response) {
            console.log(TAG, 'Error in getOrder:', error.response.status, error.response.data.message);
        } else {
            console.log(TAG, 'Error in getOrder:', error);
        }
        throw error;
    }

    return response;
}

async function getWorker(id) {
    let response;
    try {
        response = await axios.get(`/worker/${id}`);
    } catch (error) {
        if (error.response) {
            console.log(TAG, 'Error in getWorker:', error.response.status, error.response.data.message);
        } else {
            console.log(TAG, 'Error in getWorker:', error);
        }
        throw error;
    }

    return response;
}

async function completeOrder(data) {
    try {
        console.log(TAG, data);
        let response = await axios.post('/order/end_work', data);
        console.log(TAG, 'completeOrder response.data:', response.data);
        console.log(TAG, 'completeOrder response.status:', response.status);
    } catch (error) {
        if (error.response) {
            console.log(TAG, 'Error in completeOrder:', error.response.status, error.response.data.message);
        } else {
            console.log(TAG, 'Error in completeOrder:', error);
        }
        throw error;
    }
}

export default { cancelOrder, getDispatcher, startOrder, getOrder, getWorker, completeOrder };

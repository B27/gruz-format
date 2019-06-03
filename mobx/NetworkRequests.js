import axios from 'axios';
import { AsyncStorage } from 'react-native';

async function getDispatcher(id) {
    let response;
    try {
        response = await axios.get(`/dispatcher/${id}`);
        console.log('getDispatcher response.data: ', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error in getDispatcher:', error.response.status, error.response.data.message);
        } else {
            console.log('Error in getDispatcher:', error);
        }
        throw error;
    }

    return response;
}

async function startOrder(id) {
    try {
        const userId = await AsyncStorage.getItem('userId');
        let response = await axios.patch(`/order/workers/${id}/${userId}`);
        console.log('startOrder response.status:', response.status, response.data.msg);
    } catch (error) {
        if (error.response) {
            console.log('Error in startOrder:', error.response.status, error.response.data.message);
        } else {
            console.log('Error in startOrder:', error);
        }
        throw error;
    }
}

async function cancelOrder() {
    try {
        let response = await axios.post(`/order/cancel_work`);
        console.log('cancelOrder response.status:', response.status);
    } catch (error) {
        if (error.response) {
            console.log('Error in cancelOrder:', error.response.status, error.response.data.message);
        } else {
            console.log('Error in cancelOrder:', error);
        }
        throw error;
    }
}

async function getOrder(id) {
    let response;
    try {
        response = await axios.get(`/order/${id}`);
        //console.log('getOrder response.data:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error in getOrder:', error.response.status, error.response.data.message);
        } else {
            console.log('Error in getOrder:', error);
        }
        throw error;
    }

    return response;
}

async function completeOrder(data) {
    try {
        console.log(data);
        let response = await axios.post('/order/end_work', data);
        console.log('completeOrder response.data:', response.data);
        console.log('completeOrder response.status:', response.status);
    } catch (error) {
        if (error.response) {
            console.log('Error in completeOrder:', error.response.status, error.response.data.message);
        } else {
            console.log('Error in completeOrder:', error);
        }
        throw error;
    }
}

export default { cancelOrder, getDispatcher, startOrder, getOrder, completeOrder };

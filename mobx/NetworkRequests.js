import axios from 'axios';
import { AsyncStorage } from 'react-native';

async function getDispatcher(id) {
    console.log('dispatherId: ', id);
    let response = await axios.get(`/dispatcher/${id}`);
    console.log('getDispatcher >>>', response.data);

    return response;
}

async function startOrder(id) {
    const userId = await AsyncStorage.getItem('userId');
    let response = await axios.patch(`/order/workers/${id}/${userId}`);
    console.log('start order  >>>', response.status);
}

async function cancelOrder() {
    let response = await axios.post(`/order/cancel_work`);
    console.log('cancel order  >>>', response.status);
}

async function getOrder(id) {
    let response = await axios.get(`/order/${id}`);
    console.log('get order  >>>', response.data);
    return response;
}

export default { cancelOrder, getDispatcher, startOrder, getOrder };

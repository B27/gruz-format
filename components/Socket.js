import { AsyncStorage } from 'react-native';
import io from 'socket.io-client';
import { URL } from '../constants'


let socket = undefined;

export async function getSocket (){
    if (socket===undefined) {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        
        if (token) {
            socket = io(URL + '/socket', {query: { token}});
        }
    }
    return socket;
}
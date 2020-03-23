import axios from "axios";
import Store from "../mobx/Store"



export default async function networkErrorHandler(TAG, error, route) {
    console.log('[networkErrorHandler]:', TAG, route, error);
    //const userId = Store.userId
    if (error.isAxiosError) {
        if (error.response) {
            /*await axios.post(`/worker/${userId}/error`,{component:TAG, error, route})*/
            throw `Ошибка ${error.response.status},  ${error.response.data.message}`;
        }
        if (error.message.includes('Network Error')) {
            throw 'Ошибка, проверьте подключение к сети';
        }
    } else {
        /*await axios.post(`/worker/${userId}/error`,{component:TAG, error, route})*/
        throw `Внутренняя ошибка, ${error}`;
    }

}

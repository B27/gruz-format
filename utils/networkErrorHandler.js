import netInfo from '@react-native-community/netinfo';


export default async function networkErrorHandler(TAG, error, route) {
    console.log('~networkErrorHandler~', TAG, route, error);

    if (error.isAxiosError) {
        if (error.response) {
            throw `Ошибка ${error.response.status},  ${error.response.data.message}`;
        }
        if (error.message.includes('Network Error')) {
            const state = await netInfo.fetch();
            if (state.isInternetReachable) {
                throw 'Ошибка, сервер недоступен'; 
            } else {
                throw 'Ошибка, проверьте подключение к сети';
            }
        }
    } else {
        throw `Внутренняя ошибка, ${error}`;
    }

}

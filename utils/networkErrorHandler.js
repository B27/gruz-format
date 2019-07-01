export default function networkErrorHandler(TAG, error, route) {
    console.log(TAG, route, error);
    if (error.isAxiosError) {
        if (error.response) {
            throw `Ошибка ${error.response.status},  ${error.response.data.message}`;
        }
        if (error.message.includes('Network Error')) {
            throw 'Ошибка, проверьте подключение к сети';
        }
    } else {
        throw `Внутренняя ошибка, ${error}`;
    }
}

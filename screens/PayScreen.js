import { inject } from 'mobx-react/native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { errorPayUrl, succesfulPayUrl } from '../constants';
import { logError, logInfo, logScreenView } from '../utils/FirebaseAnalyticsLogger';
import showAlert from '../utils/showAlert';

const TAG = '~PayScreen~';
@inject('store')
class PayScreen extends React.Component {
    state = {
        sum: null,
        userId: null,
    };

    static navigationOptions = {
        title: 'Баланс',
        headerTintColor: 'black',
    };

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            logScreenView(TAG);
        });
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    render() {
        const url = this.props.navigation.getParam('url');

        return (
            <>
                <WebView
                    onNavigationStateChange={(navState) => {
                        console.log(navState);
                        if (navState.url.includes(succesfulPayUrl)) {
                            showAlert('Успешно', 'Пополнение баланса прошло успешно');
                            setTimeout(() => this.props.store.updateUserInfo(), 5000);
                            logInfo({ TAG, info: 'succesful pay' });
                            this.props.navigation.navigate('Main');
                        }
                        if (navState.url.includes(errorPayUrl)) {
                            showAlert('Ошибка', 'Не удалось пополнить баланс');
                            logError({ TAG, info: 'error in pay webview' });
                            this.props.navigation.navigate('Balance');
                        }
                    }}
                    source={{
                        uri: url,
                    }}
                />
                <SafeAreaView />
            </>
        );
    }
}

export default PayScreen;

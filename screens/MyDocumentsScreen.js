import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import mime from 'mime/lite';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Keyboard, Linking, ScrollView, Text, View } from 'react-native';
import LoadingButton from '../components/LoadingButton';
import NumericInput from '../components/NumericInput';
import { privacyPolicyURL } from '../constants';
import styles from '../styles';
import showAlert from '../utils/showAlert';
import PhotoChoicer from './modals/ChoiceCameraRoll';

const TAG = '~SignUpDocumentsScreen~';

@inject('store')
@observer
class MyDocumentsScreen extends React.Component {
    state = {
        choiceModalVisible: false,
        firstPageUri: null,
        secondPageUri: null,
        firstPage: true,
        passportNumber: '',
        passportSeries: '',
        message: null,
        policy: false,
        policyURL: privacyPolicyURL,
    };

    static navigationOptions = {
        title: 'Регистрация',
        headerLeft: null,
    };

    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            Keyboard.dismiss();
        });

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            (async () => {
                try {
                    await this.props.store.getUserInfo();
                    //await CacheManager.clearCache();
                    this.setState({ ...this.props.store, message: '' });
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log(error);
                    console.log('Ошибка при получении новых данных, проверьте подключение к сети');
                    return;
                }
            })();
        });

        this.setState(this.props.store);
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
        if (this.keyboardDidHideListener) {
            this.keyboardDidHideListener.remove();
        }
    }
    render() {
        return (
            <ScrollView contentContainerStyle={styles.registrationScreen}>
                <View style={styles.inputContainer}>
                    <NumericInput
                        onlyNum
                        style={styles.input}
                        placeholder="Номер паспорта"
                        onChangeText={(passportNumber) => this.setState({ passportNumber })}
                        value={this.state.passportNumber}
                    />
                    <NumericInput
                        onlyNum
                        style={styles.input}
                        placeholder="Серия паспорта"
                        onChangeText={(passportSeries) => this.setState({ passportSeries })}
                        value={this.state.passportSeries}
                    />
                    <Text>Фотография первой страницы паспорта:</Text>
                    <PhotoChoicer
                        containerStyle={styles.fullScreenPicture}
                        refreshImage={this.props.store.refreshImage}
                        onChange={(uri) => this.setState({ firstPageUri: uri })}
                        uri={this.state.firstPageUri || this.props.store.firstPageUri}
                        size={200}
                    />
                    <Text>Фотография страницы паспорта c пропиской:</Text>
                    <PhotoChoicer
                        containerStyle={styles.fullScreenPicture}
                        refreshImage={this.props.store.refreshImage}
                        onChange={(uri) => this.setState({ secondPageUri: uri })}
                        uri={this.state.secondPageUri || this.props.store.secondPageUri}
                        size={200}
                    />
                </View>
                <View style={styles.policy}>
                    <CheckBox
                        value={this.state.policy}
                        onValueChange={() => this.setState({ policy: !this.state.policy })}
                    />
                    <View style={{ flexDirection: 'column' }}>
                        <Text>Я согласен на обработку моих персональных данных</Text>
                        <Text
                            style={{ color: '#c69523' }}
                            onPress={() => {
                                Linking.openURL(this.state.policyURL);
                            }}
                        >
                            Сублицензионное соглашение
                        </Text>
                    </View>
                </View>

                <Text style={{ color: 'red' }}>{this.state.message}</Text>
                <LoadingButton
                    style={styles.buttonBottom}
                    onPress={this._nextScreen}
                    // eslint-disable-next-line react-native/no-raw-text
                >
                    ПРОДОЛЖИТЬ
                </LoadingButton>
            </ScrollView>
        );
    }

    async uploadImages({ passPic, passRegPic }) {
        try {
            const data = new FormData();
            //console.log(this.state.pictureUri);
            if (passPic) {
                data.append('pass', {
                    uri: passPic,
                    type: mime.getType(passPic),
                    name: 'image.jpg',
                });
            }
            if (passRegPic) {
                data.append('pass_reg', {
                    uri: passRegPic,
                    type: mime.getType(passRegPic),
                    name: 'image.jpg',
                });
            }
            //console.log(data);

            await axios.patch('/worker/upload/' + this.state.userId, data);
        } catch (error) {
            console.log('Download photos error: ', error);
            if (error.response) {
                showAlert(
                    'Ошибка при отправке данных',
                    'Попробуйте сделать это позже\n' + error.response.data.message,
                    { okFn: undefined },
                );
            } else {
                showAlert('Ошибка при отправке данных', 'Попробуйте попозже', { okFn: undefined });
            }
        }
    }

    _nextScreen = async () => {
        if (this.state.policy === false) {
            this.setState({
                message: 'Для продолжения необходимо принять условия сублицензионного соглашения',
            });
        } else {
            const passPic = this.state.firstPageUri;
            const passRegPic = this.state.secondPageUri;

            if (!passPic) {
                this.setState({
                    message: 'Для продолжения необходимо загрузить фото 1 страницы паспорта',
                });
                return;
            }

            if (!passRegPic) {
                this.setState({
                    message: 'Для продолжения необходимо загрузить фото страницы паспорта c регистрацией',
                });
                return;
            }

            if (!this.state.passportNumber || !this.state.passportSeries) {
                this.setState({
                    message: 'Для продолжения необходимо указать номер и серию паспорта',
                });
                return;
            }

            const dataToSend = {
                passportNumber: this.state.passportNumber,
                passportSeries: this.state.passportSeries,
                agreement: this.state.agreement,
                docStatus: 'updated',
            };

            try {
                console.log('Data to server: ', dataToSend);
                const id = await AsyncStorage.getItem('userId');
                console.log('[MyDocumentsScreen]._nextScreen() user_id', id);
                const res = await axios.patch('/worker/' + id, dataToSend);
                console.log('[MyDocumentsScreen]._nextScreen() res from server', res);
                await this.uploadImages({ passPic, passRegPic });
                showAlert('Успешно', 'Данные обновлены!', { okFn: undefined });
            } catch (error) {
                console.log('[MyDocumentsScreen]._nextScreen() err', error);
                if (error.response) {
                    showAlert(
                        'Ошибка при отправке данных',
                        'Попробуйте сделать это позже\n' + error.response.data.message,
                        { okFn: undefined },
                    );
                } else {
                    showAlert('Ошибка при отправке данных', 'Попробуйте сделать это позже', { okFn: undefined });
                }
                return;
            }
        }
    };
}

export default MyDocumentsScreen;

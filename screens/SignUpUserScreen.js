import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import mime from 'mime/lite';
import React from 'react';
import { Keyboard, Linking, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PickerSelect from 'react-native-picker-select';
import LoadingButton from '../components/LoadingButton';
import NumericInput from '../components/NumericInput';
import { privacyPolicyURL } from '../constants';
import styles from '../styles';
import { logButtonPress, logError, logScreenView } from '../utils/FirebaseAnalyticsLogger';
import showAlert from '../utils/showAlert';
import PhotoChoicer from './modals/ChoiceCameraRoll';

const TAG = '~SignUpUserScreen~';

class SignUpUserScreen extends React.Component {
    state = {
        choiceModalVisible: false,
        _choiceModalVisible: false,
        firstname: '',
        lastname: '',
        patronimyc: '',
        phone: '',
        password: '',
        repeatPassword: '',
        birthDate: '',
        city: '',
        cityId: null,
        // height: '',
        // weight: '',
        message: '',
        street: '',
        house: '',
        flat: '',
        cities: [],
        list: [],
        isDriver: false,

        bodyType: null,
        isOpen: null,
        types: [
            { name: 'Рефрижератор (крытый)', isOpen: false },
            { name: 'Термобудка (крытый)', isOpen: false },
            { name: 'Кран. борт', isOpen: true },
            { name: 'Тент (крытый)', isOpen: false },
            { name: 'Будка (крытый)', isOpen: false },
            { name: 'Открытый борт', isOpen: true },
        ],
        loadCapacity: '',
        length: '',
        width: '',
        veh_height: '',
        veh_stateCarNumber: '',

        policy: false,
        policyURL: privacyPolicyURL,
        userImgUri: null,
        vehicleImgUri: null,
    };
    static navigationOptions = {
        title: 'Регистрация',
        headerTintColor: 'black',
    };

    // choiceModalVisible: false,
    // pictureUri: require('../images/unknown.png'),
    // lastname: '',
    // firstname: '',
    // patronimyc: '',
    // phone: '',
    // password: '',
    // birthDate: 'Дата рождения',
    // city: '',
    // cityId: null,
    // street: '',
    // house: '',
    // flat: '',
    // height: '',
    // weight: '',
    // message: '',
    // cities: [],
    // list: [],
    // userId: null
    componentDidMount() {
        (async () => {
            this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
                logScreenView(TAG);
            });
            try {
                (async () =>
                    this.setState({
                        cities: [
                            ...(await axios.get('/cities/1000/1')).data.map(({ name, id }) => ({
                                name,
                                id,
                            })),
                        ],
                    }))();
            } catch (err) {
                console.log(err);
            }
        })();

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            Keyboard.dismiss();
        });
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
        if (this.keyboardDidHideListener) {
            this.keyboardDidHideListener.remove();
        }
    }

    checkPasswordAndRepeatPassword() {
        if (
            this.state.password !== '' &&
            this.state.repeatPassword !== '' &&
            this.state.repeatPassword !== this.state.password
        ) {
            return <Text style={styles.redText}>Пароли не совпадают!</Text>;
        }
        return null;
    }

    render() {
        return (
            <>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={styles.registrationScreen}
                >
                    <PhotoChoicer
                        onChange={(uri) => this.setState({ userImgUri: uri })}
                        uri={this.state.userImgUri}
                        size={200}
                    />

                    <View style={[styles.inputContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => {
                                this.setState({ isDriver: true });
                            }}
                        >
                            <View
                                style={{
                                    height: 24,
                                    width: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#000',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}
                            >
                                {this.state.isDriver ? (
                                    <View
                                        style={{
                                            height: 12,
                                            width: 12,
                                            borderRadius: 6,
                                            backgroundColor: '#000',
                                        }}
                                    />
                                ) : null}
                            </View>
                            <Text>Водитель</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => {
                                this.setState({ isDriver: false });
                            }}
                        >
                            <View
                                style={{
                                    height: 24,
                                    width: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#000',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}
                            >
                                {!this.state.isDriver ? (
                                    <View
                                        style={{
                                            height: 12,
                                            width: 12,
                                            borderRadius: 6,
                                            backgroundColor: '#000',
                                        }}
                                    />
                                ) : null}
                            </View>
                            <Text>Грузчик</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer} behavior="padding" enabled>
                        <TextInput
                            style={styles.input}
                            placeholder="Номер телефона"
                            placeholderTextColor="grey"
                            onChangeText={(phone) => this.setState({ phone: phone.replace(/[ \(\)]/g, '') })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Пароль"
                            secureTextEntry={true}
                            textContentType="newPassword"
                            placeholderTextColor="grey"
                            onChangeText={(password) => this.setState({ password })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Повторите пароль"
                            secureTextEntry={true}
                            textContentType="none"
                            placeholderTextColor="grey"
                            onChangeText={(repeatPassword) => this.setState({ repeatPassword })}
                        />
                        {this.checkPasswordAndRepeatPassword()}
                        <TextInput
                            style={styles.input}
                            placeholder="Имя"
                            placeholderTextColor="grey"
                            onChangeText={(firstname) => this.setState({ firstname })}
                        />
                        <PickerSelect
                            style={{
                                inputIOS: {
                                    height: 45,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    paddingLeft: 16,
                                    marginBottom: 15,
                                    fontSize: 16,
                                    justifyContent: 'center',
                                },
                                inputAndroid: {
                                    height: 45,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    paddingLeft: 16,
                                    marginBottom: 15,
                                    fontSize: 16,
                                    justifyContent: 'center',
                                    color: 'black',
                                },
                                placeholder: {
                                    color: 'grey',
                                },
                            }}
                            value={this.state.cityId}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({
                                    cityId: itemValue,
                                })
                            }
                            doneText="Готово"
                            placeholder={{ label: 'Город', value: null }}
                            useNativeAndroidPickerStyle={false}
                            items={this.state.cities.map(({ name: city, id: id }) => ({
                                label: city,
                                value: id,
                                key: id,
                            }))}
                        />

                        <NumericInput
                            onlyNum
                            style={styles.input}
                            placeholder="Год рождения"
                            onChangeText={(birthDate) => this.setState({ birthDate })}
                            value={this.state.birthDate}
                        />

                        {/* {!this.state.isDriver && (
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <NumericInput
                                    onlyNum
                                    style={styles.inputHalf}
                                    placeholder="Рост (cм)"
                                    onChangeText={(height) => this.setState({ height })}
                                    value={this.state.height}
                                />
                                <View style={{ width: 15 }} />
                                <NumericInput
                                    onlyNum
                                    style={styles.inputHalf}
                                    placeholder="Вес (кг)"
                                    onChangeText={(weight) => this.setState({ weight })}
                                    value={this.state.weight}
                                />
                            </View>
                        )} */}

                        {this.state.isDriver && (
                            <View>
                                <PickerSelect
                                    style={{
                                        inputIOS: {
                                            height: 45,
                                            borderWidth: 1,
                                            borderRadius: 15,
                                            paddingLeft: 16,
                                            marginBottom: 15,
                                            fontSize: 16,
                                            justifyContent: 'center',
                                        },
                                        inputAndroid: {
                                            height: 45,
                                            borderWidth: 1,
                                            borderRadius: 15,
                                            paddingLeft: 16,
                                            marginBottom: 15,
                                            fontSize: 16,
                                            justifyContent: 'center',
                                            color: 'black',
                                        },
                                        placeholder: {
                                            color: 'grey',
                                        },
                                    }}
                                    value={this.state.bodyType}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({
                                            bodyType: itemValue,
                                            isOpen: this.state.types[itemIndex - 1].isOpen,
                                        });
                                    }}
                                    doneText="Готово"
                                    placeholder={{ label: 'Тип кузова', value: null }}
                                    useNativeAndroidPickerStyle={false}
                                    items={this.state.types.map(({ name }) => ({
                                        label: name,
                                        value: name,
                                        key: name,
                                    }))}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Гос. номер"
                                    placeholderTextColor="grey"
                                    onChangeText={(veh_stateCarNumber) => this.setState({ veh_stateCarNumber })}
                                />
                                <NumericInput
                                    style={styles.input}
                                    placeholder="Грузоподъёмность (т)"
                                    onChangeText={(loadCapacity) => this.setState({ loadCapacity })}
                                    value={this.state.loadCapacity}
                                />
                                <Text style={styles.descriptionTwo}>Кузов:</Text>
                                <NumericInput
                                    style={styles.input}
                                    placeholder="Длина (м)"
                                    onChangeText={(length) => this.setState({ length })}
                                    value={this.state.length}
                                />
                                <NumericInput
                                    style={styles.input}
                                    placeholder="Ширина (м)"
                                    onChangeText={(width) => this.setState({ width })}
                                    value={this.state.width}
                                />
                                {!this.state.isOpen && (
                                    <NumericInput
                                        style={styles.input}
                                        placeholder="Высота (м)"
                                        onChangeText={(veh_height) => this.setState({ veh_height })}
                                        value={this.state.veh_height}
                                    />
                                )}
                                <Text style={styles.descriptionTwo}>Фото авто:</Text>
                                <PhotoChoicer
                                    containerStyle={{ marginBottom: 12 }}
                                    onChange={(uri) => this.setState({ vehicleImgUri: uri })}
                                    uri={this.state.vehicleImgUri}
                                    size={140}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.policy}>
                        <CheckBox
                            value={this.state.policy}
                            onValueChange={() => this.setState({ policy: !this.state.policy })}
                        />
                        <View style={[{ flexDirection: 'column' }, Platform.OS === 'ios' && { marginLeft: 8 }]}>
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
                {Platform.OS === 'ios' && <KeyboardSpacer />}
            </>
        );
    }

    isValidFields = async () => {
        console.log('[SignUpUserScreen].isValidFields() this.state.bodyType', this.state.bodyType);
        if (!this.state.userImgUri)
            return 'Загрузите свое фото! (Нажмите на картинку с фотоаппаратом в самом начале окна регистрации )';
        if (this.state.phone === '') return 'Заполните номер';
        if (this.state.phone.length !== 11) return 'Ваш номер должен содержать ровно 11 символов';
        if (!/^8/g.test(this.state.phone)) return 'Ваш номер должен начинаться с 8';
        if (this.state.password === '') return 'Введите пароль';
        if (this.state.repeatPassword === '') return 'Повторите пароль';
        if (this.state.repeatPassword !== this.state.password) return 'Пароли не совпадают';
        if (this.state.firstname === '') return 'Заполните имя';
        if (!this.state.cityId) return 'Укажите город';
        if (this.state.birthDate.length !== 4 || this.state.birthDate === '') return 'Укажите год рождения';
        if (this.state.isDriver) {
            if (this.state.bodyType === null || this.state.isOpen === null) return 'Выберите тип кузова';
            if (this.state.veh_stateCarNumber === null || this.state.veh_stateCarNumber === '')
                return 'Заполните государственный регистрационный номер авто';
            if (this.state.loadCapacity === '') return 'Заполните максимальную грузоподъемность';
            if (this.state.length === null || this.state.length === '') return 'Заполните длину авто';
            if (this.state.width === null || this.state.width === '') return 'Заполните ширину авто';
            if (!this.state.isOpen && (this.state.veh_height === null || this.state.veh_height === ''))
                return 'Заполните высоту авто';
            if (!this.state.vehicleImgUri) return 'Загрузите 1 фото авто';
        }
        if (this.state.policy === false)
            return 'Для продолжения регистрации необходимо принять условия сублицензионного соглашения';

        return null;
    };

    _nextScreen = async () => {
        logButtonPress({ TAG, info: 'next screen' });
        const errorMessage = await this.isValidFields();

        if (errorMessage !== null) {
            showAlert('Ошибка', errorMessage);
            return;
        }

        const city = this.state.cities.filter(({ id }) => id === this.state.cityId)[0].name;

        let userData = {
            name: `${this.state.lastname} ${this.state.firstname} ${this.state.patronimyc}`,
            login: this.state.phone,
            phoneNum: this.state.phone,
            password: this.state.password,
            birthDate: new Date(this.state.birthDate, 0, 1),
            address: `${city} ${this.state.street} ${this.state.house} ${this.state.flat}`,
            city: this.state.cityId,
            isDriver: this.state.isDriver,
        };

        if (this.state.isDriver) {
            userData = {
                ...userData,
                veh_is_open: this.state.isOpen,
                veh_height: this.state.isOpen ? '4' : this.state.veh_height,
                veh_width: this.state.width,
                veh_length: this.state.length,
                veh_loadingCap: this.state.loadCapacity,
                veh_frameType: this.state.bodyType,
                veh_stateCarNumber: this.state.veh_stateCarNumber,
            };
        }

        try {
            const res = await axios.post('/worker', userData);
            this.setState({ userId: res.data._id });
            await AsyncStorage.setItem('userId', this.state.userId);
        } catch (error) {
            await logError({ TAG, error, info: 'registration new user' });
            if (error.response) {
                if (error.response.data.message.indexOf('duplicate key error') !== -1) {
                    showAlert('Ошибка', 'Пользователь с таким номером телефона уже зарегистрирован');
                } else {
                    showAlert(
                        'Ошибка при отправке данных',
                        'Попробуйте сделать это позже\n' + error.response.data.message,
                    );
                }
            } else {
                showAlert('Ошибка при отправке данных', 'Попробуйте сделать это позже');
            }
            return;
        }

        try {
            const response = await axios.post('/login', {
                login: userData.login,
                password: userData.password,
            });
            //console.log('respLogin: ', response);
            await AsyncStorage.setItem('token', response.data.token);

            axios.defaults.headers = {
                Authorization: 'Bearer ' + response.data.token,
            };
        } catch (error) {
            await logError({ TAG, error, info: 'login after registration' });
            if (error.response) {
                showAlert(
                    'Регистрация успешна, но произошла ошибка ',
                    'Попробуйте сделать это позже\n' + error.response.data.message,
                );
            } else {
                showAlert('Регистрация успешна, но произошла ошибка ', 'Попробуйте залогиниться заново');
            }
            this.props.navigation.navigate('SignIn');
            return;
        }

        try {
            const data = new FormData();
            //console.log(this.state.pictureUri);

            data.append('user', {
                uri: this.state.userImgUri,
                type: mime.getType(this.state.userImgUri),
                name: 'image.jpg',
            });
            if (this.state.vehicleImgUri) {
                data.append('vehicle0', {
                    uri: this.state.vehicleImgUri,
                    type: mime.getType(this.state.vehicleImgUri),
                    name: 'image.jpg',
                });
            }
            //console.log(data);

            await axios.patch('/worker/upload/' + this.state.userId, data);
            this.props.navigation.navigate('AuthLoading');
        } catch (error) {
            logError({ TAG, error, info: 'upload new user photo' });
            if (error.response) {
                showAlert('Ошибка при загрузке фото', 'Попробуйте сделать это позже\n' + error.response.data.message);
            } else {
                showAlert('Ошибка при загрузке фото', 'Попробуйте произвести загрузку фото позже');
            }
            this.props.navigation.navigate('AuthLoading');
        }
    };

    // openDatePicker = async () => {
    //     try {
    //         const { action, year, month, day } = await DatePickerAndroid.open({
    //             date: new Date(),
    //         });
    //         if (action !== DatePickerAndroid.dismissedAction) {
    //             console.log(year, month, day);

    //             let date = new Date(year, month, day);
    //             this.setState({ birthDate: date });
    //         }
    //     } catch ({ code, message }) {
    //         console.warn('Cannot open date picker', message);
    //     }
    // };
}

export default SignUpUserScreen;

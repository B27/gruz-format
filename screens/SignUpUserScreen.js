import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import mime from 'mime/lite';
import React from 'react';
import { Keyboard, Linking, Picker, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingButton from '../components/LoadingButton';
import NumericInput from '../components/NumericInput';
import { privacyPolicyURL } from '../constants';
import styles from '../styles';
import showAlert from '../utils/showAlert';
import PhotoChoicer from './modals/ChoiceCameraRoll';

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
        cityId: 0,
        height: '',
        weight: '',
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
            { name: 'Тип кузова', isOpen: null },
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
        headerLeft: null,
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow: 1,
            alignSelf: 'center',
        },
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
            try {
                (async () =>
                    this.setState({
                        cities: [
                            { name: 'Город', id: 1 },
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
            <ScrollView contentContainerStyle={styles.registrationScreen}>
                <PhotoChoicer
                    onChange={(uri) => this.setState({ userImgUri: uri })}
                    uri={this.state.userImgUri}
                    size={200}
                />
                {/* <TouchableOpacity onPress={() => this.openCameraRoll()}>
                        <LocalImage source={this.state.pictureUri} originalWidth={909} originalHeight={465} />
                    </TouchableOpacity> */}

                <Text>Загрузите свое фото</Text>
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
                    {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={styles.plusSevenText}>+7</Text>
                            <TextInput
                                style={[styles.input, {alignSelf: 'stretch', width: '70%'}]}
                                placeholder='Номер телефона'
                                placeholderTextColor='grey'
                                onChangeText={phone => this.setState({ phone })}
                            />
                        </View>*/}
                    <TextInput
                        style={styles.input}
                        placeholder="Номер телефона"
                        placeholderTextColor="grey"
                        onChangeText={(phone) => this.setState({ phone: phone.replace(/[ \(\)]/g, '') })}
                    />

                    {/* [var_name]: "phone" */}

                    <TextInput
                        style={styles.input}
                        placeholder="Пароль"
                        secureTextEntry={true}
                        placeholderTextColor="grey"
                        onChangeText={(password) => this.setState({ password })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Повторите пароль"
                        secureTextEntry={true}
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
                    <View
                        style={{
                            height: 45,
                            borderWidth: 1,
                            borderRadius: 15,
                            paddingLeft: 5,
                            marginBottom: 15,
                            justifyContent: 'center',
                        }}
                    >
                        <Picker
                            selectedValue={this.state.cityId}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({
                                    cityId: itemValue,
                                })
                            }
                            placeholder="Город"
                        >
                            {this.state.cities.map(({ name: city, id: id }, index) => {
                                return (
                                    <Picker.Item color={!index ? 'grey' : 'black'} key={city} label={city} value={id} />
                                );
                            })}
                        </Picker>
                    </View>
                    {/*<TouchableOpacity style={styles.input} onPress={() => this.openDatePicker()}>
                            <Text style={styles.datePickerText}>
                                {this.state.birthDate != 'Дата рождения'
                                    ? `${this.state.birthDate.getDate()}.${this.state.birthDate.getMonth()+1}.${this.state.birthDate.getFullYear()}`
                                    : this.state.birthDate}
                            </Text>
                        </TouchableOpacity>*/}

                    <TextInput
                        style={styles.input}
                        placeholder="Год рождения"
                        placeholderTextColor="grey"
                        onChangeText={(birthDate) => this.setState({ birthDate })}
                    />

                    {!this.state.isDriver && (
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
                    )}

                    {this.state.isDriver && (
                        <View>
                            <View
                                style={{
                                    height: 45,
                                    borderWidth: 1,
                                    borderRadius: 15,
                                    paddingLeft: 5,
                                    marginBottom: 15,
                                    justifyContent: 'center',
                                }}
                            >
                                <Picker
                                    selectedValue={this.state.bodyType}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({
                                            bodyType: itemValue,
                                            isOpen: this.state.types[itemIndex].isOpen,
                                        });
                                        console.log(itemValue, this.state.types[itemIndex].isOpen);
                                    }}
                                    placeholder="Тип кузова"
                                >
                                    {this.state.types.map(({ name }, index) => {
                                        return (
                                            <Picker.Item
                                                color={!index ? 'grey' : 'black'}
                                                key={name}
                                                label={name}
                                                value={name}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>

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
                <LoadingButton style={styles.buttonBottom} onPress={this._nextScreen}>
                    ПРОДОЛЖИТЬ
                </LoadingButton>
            </ScrollView>
        );
    }

    isValidFields = async (city) => {
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
        if (this.state.cityId === 1 || !this.state.cityId) return 'Укажите город';
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
        } else {
            if (this.state.height === '') return 'Укажите свой рост';
            if (this.state.weight === '') return 'Укажите свой вес';
        }
        if (this.state.policy === false)
            return 'Для продолжения регистрации необходимо принять условия сублицензионного соглашения';

        return null;
    };

    _nextScreen = async () => {
        const city = this.state.cities.filter(({ id }) => id === this.state.cityId)[0].name;
        const errorMessage = await this.isValidFields(city);
        if (errorMessage !== null) {
            this.setState({ message: errorMessage });
        } else {
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
            } else {
                userData = {
                    ...userData,
                    height: this.state.height,
                    weight: this.state.weight,
                };
            }

            try {
                console.log('Data to server: ', userData);
                const res = await axios.post('/worker', userData);
                //console.log('REGISTRATION: ', res);
                this.setState({ userId: res.data._id });
                await AsyncStorage.setItem('userId', this.state.userId);
                //this.props.navigation.navigate('Documents');
            } catch (error) {
                console.log('ERROR_POST:', error);
                if (error.response) {
                    if (error.response.data.message.indexOf('duplicate key error') !== -1) {
                        showAlert('Ошибка', 'Пользователь с таким номером телефона уже зарегистрирован', {
                            okFn: undefined,
                        });
                    } else {
                        showAlert(
                            'Ошибка при отправке данных',
                            'Попробуйте сделать это позже\n' + error.response.data.message,
                            { okFn: undefined },
                        );
                    }
                } else {
                    showAlert('Ошибка при отправке данных', 'Попробуйте сделать это позже', { okFn: undefined });
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
                console.log('ОШИБКА', error);
                if (error.response) {
                    showAlert(
                        'Регистрация успешна, но произошла ошибка ',
                        'Попробуйте сделать это позже\n' + error.response.data.message,
                        { okFn: undefined },
                    );
                } else {
                    showAlert('Регистрация успешна, но произошла ошибка ', 'Попробуйте залогиниться заново', {
                        okFn: undefined,
                    });
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
                console.log('Download photos error: ', error);
                console.dir(error, { depth: null });
                if (error.response) {
                    showAlert(
                        'Ошибка при загрузке фото',
                        'Попробуйте сделать это позже\n' + error.response.data.message,
                        { okFn: undefined },
                    );
                } else {
                    showAlert('Ошибка при загрузке фото', 'Попробуйте произвести загрузку фото позже', {
                        okFn: undefined,
                    });
                }
                this.props.navigation.navigate('AuthLoading');
            }
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

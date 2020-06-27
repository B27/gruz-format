import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { DatePickerAndroid, Keyboard, Picker, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingButton from '../components/LoadingButton';
import LocalImage from '../components/LocalImage';
import NumericInput from '../components/NumericInput';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';
import showAlert from "../utils/showAlert";

@inject('store')
@observer
class MyInfoScreen extends React.Component {
    state = {
        choiceModalVisible: false,
        avatar: require('../images/unknown.png'),
        message: '',
        cities: [],
        list: [],
        userId: null,
        colorMessage: 'red'
    };

    static navigationOptions = {
        title: 'Моя информация',
        headerLeft: null
    };

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
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            console.log('Listener willFocus in MyInfoScreen');
            this.setState({ message: '' });
            (async () => {
                try {
                    const res = await axios.get('/cities/1000/1')
                    const cities = [
                        { name: 'Город', id: 1 },
                        ...res.data.map(({ name, id }) => ({
                            name,
                            id
                        }))
                    ]
                    await this.setState({cities})
                    console.log('[MyInfoScreen].() cities', this.state.cities)
                    /*(async () =>
                        await this.setState({
                            cities: [
                                { name: 'Город', id: 1 },
                                ...(await axios.get('/cities/1000/1')).data.map(({ name, id }) => ({
                                    name,
                                    id
                                }))
                            ]
                        }))();*/
                } catch (err) {
                    console.log(err);
                }
                try {
                    await this.props.store.getUserInfo();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log('Ошибка при получении новых данных, проверьте подключение к сети');
                    if(error.response){
                        showAlert('Ошибка', 'Ошибка при обновлении данных\n'+error.response.data.message, { okFn: undefined });
                    } else {
                        showAlert('Ошибка', 'Ошибка при обновлении данных', error.toString(), {okFn: undefined});
                    }
                    return;
                }
                await this.setState({...this.props.store, phone:this.props.store.login} );
                console.log('[MyInfoScreen].() cityId', this.state.cityId)
            })();
            /*(async () => {
                try {
                    await this.props.store.getUserInfo();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log('Ошибка при получении новых данных, проверьте подключение к сети');
                    return;
                }
                await this.setState(this.props.store);
                console.log('[MyInfoScreen].() cityId', this.state.cityId)
            })();*/
        });

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

    render() {
        return (
            <ScrollView contentContainerStyle={styles.registrationScreen}>
                <ChoiceCameraRoll
                    pickFromCamera={this.pickFromCamera}
                    selectPicture={this.selectPicture}
                    visible={this.state.choiceModalVisible}
                    closeModal={this.closeModals}
                />
                <TouchableOpacity onPress={() => this.openCameraRoll()}>
                    <LocalImage source={this.state.avatar} originalWidth={909} originalHeight={465} />
                </TouchableOpacity>
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
                                marginRight: 14
                            }}
                        >
                            {this.state.isDriver ? (
                                <View
                                    style={{
                                        height: 12,
                                        width: 12,
                                        borderRadius: 6,
                                        backgroundColor: '#000'
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
                                marginRight: 14
                            }}
                        >
                            {!this.state.isDriver ? (
                                <View
                                    style={{
                                        height: 12,
                                        width: 12,
                                        borderRadius: 6,
                                        backgroundColor: '#000'
                                    }}
                                />
                            ) : null}
                        </View>
                        <Text>Грузчик</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>

                    {/* [var_name]: "phone" */}
                    <TextInput
                        style={styles.input}
                        placeholder='Номер телефона'
                        placeholderTextColor='grey'
                        onChangeText={phone => this.setState({ phone: phone.replace(/[ \(\)]/g,'') })}
                        value={this.state.phone}
                        fullWidth
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Имя'
                        placeholderTextColor='grey'
                        onChangeText={firstName => this.setState({ firstName })}
                        value={this.state.firstName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Фамилия'
                        placeholderTextColor='grey'
                        onChangeText={lastName => this.setState({ lastName })}
                        value={this.state.lastName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Отчество'
                        placeholderTextColor='grey'
                        onChangeText={patronymic => this.setState({ patronymic })}
                        value={this.state.patronymic}
                    />

                    <View
                        style={{
                            height: 45,
                            borderWidth: 1,
                            borderRadius: 15,
                            paddingLeft: 5,
                            marginBottom: 15,
                            justifyContent: 'center'
                        }}
                    >
                        <Picker
                            selectedValue={this.state.cityId}
                            onValueChange={async (itemValue, itemIndex) =>
                                await this.setState({
                                    cityId: itemValue
                                })
                            }
                            placeholder='Город'
                        >
                            {this.state.cities.map(({ name: city, id: id }, index) => {
                                //console.log(city, id);

                                return (
                                    <Picker.Item color={!index ? 'grey' : 'black'} key={city} label={city} value={id} />
                                );
                            })}
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder='Улица'
                        placeholderTextColor='grey'
                        onChangeText={street => this.setState({ street })}
                        value={this.state.street}
                    />
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder='Дом'
                            onChangeText={house => this.setState({ house })}
                            value={this.state.house}
                        />
                        <View style={{ width: 15 }} />
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder='Квартира'
                            onChangeText={flat => this.setState({ flat })}
                            value={this.state.flat}
                        />
                    </View>
                    <TouchableOpacity style={styles.input} onPress={() => this.openDatePicker()}>
                        <Text style={styles.datePickerText}>{this.getBirthDate()}</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder='Рост (cм)'
                            onChangeText={height => this.setState({ height })}
                            value={this.state.height ? this.state.height.toString() : ''}
                        />
                        <View style={{ width: 15 }} />
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder='Вес (кг)'
                            onChangeText={weight => this.setState({ weight })}
                            value={this.state.weight ? this.state.weight.toString() : ''}
                        />
                    </View>
                </View>
                <Text style={{ color: this.state.colorMessage }}>{this.state.message}</Text>
                <LoadingButton style={styles.buttonBottom} onPress={this._nextScreen}>
                    СОХРАНИТЬ
                </LoadingButton>
            </ScrollView>
        );
    }
    getBirthDate = () => {
        if (this.state.birthDate !== undefined && this.state.birthDate !== 'Дата рождения') {
            const date = this.state.birthDate;
            // console.log(date + ' ----------------------');
            return `${this.state.birthDate.getDate()}.${this.state.birthDate.getMonth()+1}.${this.state.birthDate.getFullYear()}`;
        } else {
            return;
        }
    };

    isValidFields = async (city) => {
        if (typeof this.state.pictureUri === 'number') return 'Загрузите свое фото!'
        if (this.state.firstname === '' ) return 'Заполните имя'
        if (this.state.lastName === '' ) return 'Заполните фамилию'
        if (this.state.patronymic === '' ) return 'Заполните отчество'
        if (this.state.phone === '' ) return 'Заполните номер'
        if (this.state.phone.length !== 11 ) return 'Ваш номер должен содержать ровно 11 символов'
        if (  !/^8/g.test(this.state.phone) ) return 'Ваш номер должен начинаться с 8'
        if (this.state.birthDate === 'Дата рождения' ) return 'Укажите дату рождения'
        if (this.state.height === '' ) return 'Укажите свой вес'
        if (this.state.weight === '' ) return 'Укажите свой рост'
        if (city === '' ) return 'Укажите город'
        if (this.state.cityId === '') return 'Укажите город'
        if (this.state.street === '' ) return 'Заполните улицу проживания'
        if (this.state.house === '' ) return 'Заполните дом проживания'
        if (this.state.flat === '') return 'Заполните номер квартиры'
        return null
    }

    _nextScreen = async () => {
        //console.log(this.state);
        this.setState({ message: '' });

        const id = await AsyncStorage.getItem('userId');
        const city = this.state.cities.filter(({ id }) => id === this.state.cityId)[0].name;
        const error = await this.isValidFields(city)
        if (error !== null) {
            this.setState({ message: error, colorMessage: 'red' });
        } else {
            try {
                let res = await axios.patch('/worker/' + id, {
                    name: `${this.state.lastName} ${this.state.firstName} ${this.state.patronymic}`,
                    login: this.state.phone,
                    phoneNum: this.state.phone,
                    birthDate: this.state.birthDate,
                    address: `${city} ${this.state.street} ${this.state.house} ${this.state.flat}`,
                    city: this.state.cityId,
                    height: this.state.height,
                    weight: this.state.weight,
                    isDriver: this.state.isDriver
                });

                //console.log(res.data);

                const data = new FormData();
                //console.log(this.state.pictureUri);

                data.append('user', {
                    uri: this.state.avatar,
                    type: 'image/jpeg',
                    name: 'image.jpg'
                });

                // console.log(data);

                res = await axios.patch('/worker/upload/' + id, data);


                await this.props.store.refreshImages();

                await this.setState({ message: 'Данные успешно сохранены', colorMessage: 'green' });

                showAlert('Успешно!', 'Ваши данные сохраненны!', { okFn: undefined });

            } catch (error) {
                console.log(error);
                Object.keys(error).forEach(value => {console.log(error[value])})
                if(error.response){

                    if(error.response.data.message.indexOf('duplicate key error') !== -1) {
                        showAlert('Ошибка при изменении данных', 'Пользователь с таким номером телефона уже зарегистрирован', {okFn: undefined});
                    } else {
                        showAlert('Ошибка при изменении данных', 'Ошибка при обновлении данных\n'+error.response.data.message, { okFn: undefined });
                    }



                } else {
                    showAlert('Ошибка', 'Ошибка при обновлении данных', {okFn: undefined});
                }

            }
        }
    };

    openDatePicker = async () => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: this.props.store.birthDate
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                console.log(year, month, day);

                let date = new Date(year, month, day);
                this.setState({ birthDate: date });
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    };

    openCameraRoll = () => {
        this.setState({ choiceModalVisible: true });
    };

    closeModals = () => {
        this.setState({
            choiceModalVisible: false
        });
    };

    pickFromCamera = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchCameraAsync({
                mediaTypes: 'Images',
                quality: 0.3
            });
            if (!cancelled) this.setState({ avatar: uri });
        }
    };

    selectPicture = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                quality: 0.3
            });
            if (!cancelled) this.setState({ avatar: uri });
        }
    };
}

export default MyInfoScreen;

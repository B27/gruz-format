import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
import { format } from 'date-fns';
import mime from 'mime/lite';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Keyboard, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingButton from '../components/LoadingButton';
import NumericInput from '../components/NumericInput';
import PickerSelect from '../components/PickerSelect';
import styles from '../styles';
import showAlert from '../utils/showAlert';
import PhotoChoicer from './modals/ChoiceCameraRoll';

@inject('store')
@observer
class MyInfoScreen extends React.Component {
    state = {
        showDatePicker: false,
        avatar: null,
        message: '',
        cities: [{ name: 'Город', id: 1 }],
        list: [],
        userId: null,
        colorMessage: 'red',
        birthDate: null,
    };

    static navigationOptions = {
        title: 'Моя информация',
        headerLeft: null,
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
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            console.log('Listener willFocus in MyInfoScreen');
            this.setState({ message: '' });
            try {
                const res = await axios.get('/cities/1000/1');
                console.log('cities res.data', res.data);
                const cities = [
                    { name: 'Город', id: 1 },
                    ...res.data.map(({ name, id }) => ({
                        name,
                        id,
                    })),
                ];
                this.setState({ cities });
                console.log('[MyInfoScreen].() cities', this.state.cities);
            } catch (err) {
                console.log(err);
            }
            try {
                await this.props.store.getUserInfo();
            } catch (error) {
                // TODO добавить вывод ошибки пользователю
                console.log('Ошибка при получении новых данных, проверьте подключение к сети');
                if (error.response) {
                    showAlert('Ошибка', 'Ошибка при обновлении данных\n' + error.response.data.message);
                } else {
                    showAlert('Ошибка', 'Ошибка при обновлении данных', error.toString(), { okFn: undefined });
                }
                return;
            }
            console.log('Store list', this.props.store);
            this.setState({ ...this.props.store, phone: this.props.store.login });
            console.log('[MyInfoScreen].() cityId', this.state.cityId);
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
                <PhotoChoicer
                    refreshImage={this.props.store.refreshImage}
                    onChange={(uri) => this.setState({ avatar: uri })}
                    uri={this.state.avatar || this.props.store.avatar}
                    size={200}
                />
                <View
                    style={[
                        styles.inputContainer,
                        localStyles.flexDirectionRow,
                        localStyles.justifyContentSpaceBetween,
                    ]}
                >
                    <TouchableOpacity
                        style={localStyles.driverButton}
                        onPress={() => {
                            this.setState({ isDriver: true });
                        }}
                    >
                        <View style={localStyles.roundEdging}>
                            {this.state.isDriver ? <View style={localStyles.roundDot} /> : null}
                        </View>
                        <Text>Водитель</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={localStyles.flexDirectionRow}
                        onPress={() => {
                            this.setState({ isDriver: false });
                        }}
                    >
                        <View style={localStyles.roundEdging}>
                            {!this.state.isDriver ? <View style={localStyles.roundDot} /> : null}
                        </View>
                        <Text>Грузчик</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    {/* [var_name]: "phone" */}
                    <TextInput
                        style={styles.input}
                        placeholder="Номер телефона"
                        placeholderTextColor="grey"
                        onChangeText={(phone) => this.setState({ phone: phone.replace(/[ \(\)]/g, '') })}
                        value={this.state.phone}
                        fullWidth
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Имя"
                        placeholderTextColor="grey"
                        onChangeText={(firstName) => this.setState({ firstName })}
                        value={this.state.firstName}
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
                    <TextInput
                        style={styles.input}
                        placeholder="Улица"
                        placeholderTextColor="grey"
                        onChangeText={(street) => this.setState({ street })}
                        value={this.state.street}
                    />
                    <View style={[localStyles.flexOne, localStyles.flexDirectionRow]}>
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder="Дом"
                            onChangeText={(house) => this.setState({ house })}
                            value={this.state.house}
                        />
                        <View style={localStyles.divider} />
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder="Квартира"
                            onChangeText={(flat) => this.setState({ flat })}
                            value={this.state.flat}
                        />
                    </View>
                    {this.state.showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            onChange={this._handleBirthdayChange}
                            value={this.state.birthDate || this.props.store.birthDate}
                        />
                    )}
                    <TouchableOpacity style={styles.input} onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.datePickerText}>{this._getFormattedBirthDate()}</Text>
                    </TouchableOpacity>

                    <View style={[localStyles.flexOne, localStyles.flexDirectionRow]}>
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder="Рост (cм)"
                            onChangeText={(height) => this.setState({ height })}
                            value={this.state.height ? this.state.height.toString() : ''}
                        />
                        <View style={localStyles.divider} />
                        <NumericInput
                            onlyNum
                            style={styles.inputHalf}
                            placeholder="Вес (кг)"
                            onChangeText={(weight) => this.setState({ weight })}
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

    _getFormattedBirthDate = () => {
        if (this.state.birthDate || this.props.store.birthDate) {
            const date = this.state.birthDate || this.props.store.birthDate;
            // console.log(date + ' ----------------------');
            return format(date, 'dd.MM.yyyy');
        }
    };

    isValidFields = async (city) => {
        if (typeof this.state.pictureUri === 'number') return 'Загрузите свое фото!';
        if (this.state.firstname === '') return 'Заполните имя';
        if (this.state.phone === '') return 'Заполните номер';
        if (this.state.phone.length !== 11) return 'Ваш номер должен содержать ровно 11 символов';
        if (!/^8/g.test(this.state.phone)) return 'Ваш номер должен начинаться с 8';
        if (this.state.birthDate === 'Дата рождения') return 'Укажите дату рождения';
        if (this.state.height === '') return 'Укажите свой вес';
        if (this.state.weight === '') return 'Укажите свой рост';
        if (city === '') return 'Укажите город';
        if (this.state.cityId === '') return 'Укажите город';
        if (this.state.street === '') return 'Заполните улицу проживания';
        if (this.state.house === '') return 'Заполните дом проживания';
        if (this.state.flat === '') return 'Заполните номер квартиры';
        return null;
    };

    _nextScreen = async () => {
        //console.log(this.state);
        this.setState({ message: '' });

        const id = await AsyncStorage.getItem('userId');
        const city = this.state.cities.filter(({ id }) => id === this.state.cityId)[0].name;
        const fieldsNotValid = await this.isValidFields(city);
        if (fieldsNotValid !== null) {
            this.setState({ message: fieldsNotValid, colorMessage: 'red' });
        } else {
            try {
                await axios.patch('/worker/' + id, {
                    name: `${this.state.lastName} ${this.state.firstName} ${this.state.patronymic}`,
                    login: this.state.phone,
                    phoneNum: this.state.phone,
                    birthDate: this.state.birthDate || this.props.store.birthDate,
                    address: `${city} ${this.state.street} ${this.state.house} ${this.state.flat}`,
                    city: this.state.cityId,
                    height: this.state.height,
                    weight: this.state.weight,
                    isDriver: this.state.isDriver,
                });

                //console.log(res.data);

                if (this.state.avatar) {
                    const data = new FormData();

                    data.append('user', {
                        uri: this.state.avatar,
                        type: mime.getType(this.state.avatar),
                        name: 'imageFile',
                    });

                    // console.log(data);

                    await axios.patch('/worker/upload/' + id, data, { timeout: 10000 });

                    await this.props.store.refreshImages();
                }

                this.setState({ message: 'Данные успешно сохранены', colorMessage: 'green' });

                showAlert('Успешно!', 'Ваши данные сохраненны!', { okFn: undefined });
            } catch (error) {
                console.log(error);
                Object.keys(error).forEach((value) => {
                    console.log(error[value]);
                });
                if (error.response) {
                    if (error.response.data.message.indexOf('duplicate key error') !== -1) {
                        showAlert(
                            'Ошибка при изменении данных',
                            'Пользователь с таким номером телефона уже зарегистрирован',
                            { okFn: undefined },
                        );
                    } else {
                        showAlert(
                            'Ошибка при изменении данных',
                            'Ошибка при обновлении данных\n' + error.response.data.message,
                            { okFn: undefined },
                        );
                    }
                } else {
                    showAlert('Ошибка', 'Ошибка при обновлении данных', { okFn: undefined });
                }
            }
        }
    };

    _handleBirthdayChange = async (event, selectedDate) => {
        this.setState({ showDatePicker: false });
        if (!selectedDate) {
            return;
        }

        console.log('selectedDate', selectedDate);
        this.setState({ birthDate: selectedDate });
    };
}

const localStyles = StyleSheet.create({
    driverButton: { flexDirection: 'row' },
    roundEdging: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    roundDot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
    cityPicker: {
        height: 45,
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 5,
        marginBottom: 15,
        justifyContent: 'center',
    },
    divider: { width: 15 },
    flexDirectionRow: { flexDirection: 'row' },
    flexOne: { flex: 1 },
    justifyContentSpaceBetween: { justifyContent: 'space-between' },
});

export default MyInfoScreen;

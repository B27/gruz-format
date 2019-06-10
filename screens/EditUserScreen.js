import axios from 'axios';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';

import {
    DatePickerAndroid,
    Keyboard,
    KeyboardAvoidingView,
    Picker,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import LoadingButton from '../components/LoadingButton';
import LocalImage from '../components/LocalImage';
import NumericInput from '../components/NumericInput';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';

class EditUserScreen extends React.Component {
    state = {
        choiceModalVisible: false,
        pictureUri: require('../images/unknown.png'),
        lastname: '',
        firstname: '',
        patronimyc: '',
        phone: '',
        password: '',
        birthDate: 'Дата рождения',
        city: '',
        cityId: null,
        street: '',
        house: '',
        flat: '',
        height: '',
        weight: '',
        message: '',
        cities: [],
        list: [],
        userId: null,
        isDriver: false
    };
    static navigationOptions = {
        title: 'Регистрация',
        headerLeft: null,
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow: 1,
            alignSelf: 'center'
        }
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
                                id
                            }))
                        ]
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

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={85} behavior='padding'>
                <ScrollView contentContainerStyle={styles.registrationScreen}>
                    <ChoiceCameraRoll
                        pickFromCamera={this.pickFromCamera}
                        selectPicture={this.selectPicture}
                        visible={this.state.choiceModalVisible}
                        closeModal={this.closeModals}
                    />
                    <TouchableOpacity onPress={() => this.openCameraRoll()}>
                        <LocalImage source={this.state.pictureUri} originalWidth={909} originalHeight={465} />
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
                    <View style={styles.inputContainer} behavior='padding' enabled>
                        <TextInput
                            style={styles.input}
                            placeholder='Номер телефона'
                            placeholderTextColor='grey'
                            onChangeText={phone => this.setState({ phone })}
                        />

                        {/* [var_name]: "phone" */}

                        <TextInput
                            style={styles.input}
                            placeholder='Пароль'
                            secureTextEntry={true}
                            placeholderTextColor='grey'
                            onChangeText={password => this.setState({ password })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Имя'
                            placeholderTextColor='grey'
                            onChangeText={firstname => this.setState({ firstname })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Фамилия'
                            placeholderTextColor='grey'
                            onChangeText={lastname => this.setState({ lastname })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Отчество'
                            placeholderTextColor='grey'
                            onChangeText={patronimyc => this.setState({ patronimyc })}
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
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({
                                        cityId: itemValue
                                    })
                                }
                                placeholder='Город'
                            >
                                {this.state.cities.map(({ name: city, id: id }, index) => {
                                    console.log(city, id);

                                    return (
                                        <Picker.Item
                                            color={!index ? 'grey' : 'black'}
                                            key={city}
                                            label={city}
                                            value={id}
                                        />
                                    );
                                })}
                            </Picker>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='Улица'
                            placeholderTextColor='grey'
                            onChangeText={street => this.setState({ street })}
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
                            <Text style={styles.datePickerText}>
                                {this.state.birthDate != 'Дата рождения'
                                    ? `${this.state.birthDate.getDate()}.${this.state.birthDate.getMonth()}.${this.state.birthDate.getFullYear()}`
                                    : this.state.birthDate}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <NumericInput
                                onlyNum
                                style={styles.inputHalf}
                                placeholder='Рост (м)'
                                onChangeText={height => this.setState({ height })}
                                value={this.state.height}
                            />
                            <View style={{ width: 15 }} />
                            <NumericInput
                                onlyNum
                                style={styles.inputHalf}
                                placeholder='Вес (кг)'
                                onChangeText={weight => this.setState({ weight })}
                                value={this.state.weight}
                            />
                        </View>
                    </View>
                    <Text style={{ color: 'red' }}>{this.state.message}</Text>
                    <LoadingButton style={styles.buttonBottom} onPress={this._nextScreen}>
                        ПРОДОЛЖИТЬ
                    </LoadingButton>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    _nextScreen = async (offButtonSetState) => {
        const city = this.state.cities.filter(({ id }) => id === this.state.cityId)[0].name;
        if (
            typeof this.state.pictureUri === 'number' ||
            this.state.lastname === '' ||
            this.state.firstname === '' ||
            this.state.patronimyc === '' ||
            this.state.phone === '' ||
            this.state.password === '' ||
            this.state.birthDate === 'Дата рождения' ||
            this.state.height === '' ||
            this.state.weight === '' ||
            city === '' ||
            this.state.cityId === '' ||
            this.state.street === '' ||
            this.state.house === '' ||
            this.state.flat === ''
        ) {
            this.setState({ message: 'Все поля должны быть заполнены' });
        } else {
            const userData = {
                name: `${this.state.lastname} ${this.state.firstname} ${this.state.patronimyc}`,
                login: this.state.phone,
                phoneNum: this.state.phone,
                password: this.state.password,
                birthDate: this.state.birthDate,
                address: `${city} ${this.state.street} ${this.state.house} ${this.state.flat}`,
                city: this.state.cityId,
                height: this.state.height,
                weight: this.state.weight,
                isDriver: this.state.isDriver
            };
            console.log(userData);
            offButtonSetState();
            this.props.navigation.navigate('Documents', { ...userData, avatar: this.state.pictureUri });
        }
    };

    openDatePicker = async () => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date()
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
            if (!cancelled) this.setState({ pictureUri: uri });
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
            if (!cancelled) this.setState({ pictureUri: uri });
        }
    };
}

export default EditUserScreen;

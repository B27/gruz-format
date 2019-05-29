import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import {
    AsyncStorage,
    DatePickerAndroid,
    KeyboardAvoidingView,
    Picker,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import LocalImage from '../components/LocalImage';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';

@inject('store')
@observer
class MyInfoScreen extends React.Component {
    state = {
        choiceModalVisible: false,
        avatar: require('../images/unknown.png'),
        message: '',
        cities: [],
        list: [],
        userId: null
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
    componentDidMount() {}

    render() {
        this.props.navigation.addListener('willFocus', () => {
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
            (async () => {
                await this.props.store.getUserInfo();
                this.setState(this.props.store);
            })();
        });
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
                        <LocalImage source={this.state.avatar} originalWidth={909} originalHeight={465} />
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Номер телефона'
                            placeholderTextColor='grey'
                            onChangeText={phone => this.setState({ phone })}
                            value={this.state.phone}
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
                            value={this.state.street}
                        />
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                                style={styles.inputHalf}
                                placeholder='Дом'
                                placeholderTextColor='grey'
                                onChangeText={house => this.setState({ house })}
                                value={this.state.house}
                            />
                            <View style={{ width: 15 }} />
                            <TextInput
                                style={styles.inputHalf}
                                placeholder='Квартира'
                                placeholderTextColor='grey'
                                onChangeText={flat => this.setState({ flat })}
                                value={this.state.flat}
                            />
                        </View>
                        <TouchableOpacity style={styles.input} onPress={() => this.openDatePicker()}>
                            <Text style={styles.datePickerText}>{this.getBirthDate()}</Text>
                        </TouchableOpacity>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                                style={styles.inputHalf}
                                placeholder='Рост'
                                placeholderTextColor='grey'
                                keyboardType='numeric'
                                onChangeText={height => this.setState({ height })}
                                value={this.state.height ? this.state.height.toString() : ''}
                            />
                            <View style={{ width: 15 }} />
                            <TextInput
                                style={styles.inputHalf}
                                placeholder='Вес'
                                placeholderTextColor='grey'
                                keyboardType='numeric'
                                onChangeText={weight => this.setState({ weight })}
                                value={this.state.height ? this.state.weight.toString() : ''}
                            />
                        </View>
                    </View>
                    <Text style={{ color: 'green' }}>{this.state.message}</Text>
                    <TouchableOpacity style={styles.buttonBottom} onPress={() => this._nextScreen()}>
                        <Text style={styles.text}>СОХРАНИТЬ</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
    getBirthDate = () => {
        if (this.state.birthDate !== undefined && this.state.birthDate !== 'Дата рождения') {
            const date = this.state.birthDate;
            console.log(date + ' ----------------------');
            return `${this.state.birthDate.getDate()}.${this.state.birthDate.getMonth()}.${this.state.birthDate.getFullYear()}`;
        } else {
            return;
        }
    };
    _nextScreen = async () => {
        console.log(this.state);

        const id = await AsyncStorage.getItem('userId');
        const city = this.state.cities.filter(({ id }) => id === this.state.cityId)[0].name;
        if (
            typeof this.state.avatar === 'number' ||
            this.state.lastName === '' ||
            this.state.firstName === '' ||
            this.state.patronymic === '' ||
            this.state.phone === '' ||
            this.state.birthDate === 'Дата рождения' ||
            this.state.height === '' ||
            this.state.weight === '' ||
            this.state.cityId === '' ||
            city === '' ||
            this.state.street === '' ||
            this.state.house === '' ||
            this.state.flat === ''
        ) {
            this.setState({ message: 'Все поля должны быть заполнены' });
        } else {
            try {
                const res = await axios.patch('/worker/' + id, {
                    name: `${this.state.lastName} ${this.state.firstName} ${this.state.patronymic}`,
                    login: this.state.phone,
                    phoneNum: this.state.phone,
                    birthDate: this.state.birthDate,
                    address: `${city} ${this.state.street} ${this.state.house} ${this.state.flat}`,
                    city: this.state.cityId,
                    height: this.state.height,
                    weight: this.state.weight
                });
                console.log(res.data);
                this.setState({ message: 'Данные успешно сохранены' });
            } catch (error) {
                console.log(error);
            }

            const data = new FormData();
            console.log(this.state.pictureUri);

            data.append('user', {
                uri: this.state.avatar,
                type: 'image/jpeg',
                name: 'image.jpg'
            });
            console.log(data);
            await axios.patch('/worker/upload/' + id, data);
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
                mediaTypes: 'Images'
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
                aspect: [1, 1],
                allowsEditing: true
            });
            if (!cancelled) this.setState({ pictureUri: uri });
        }
    };
}

export default MyInfoScreen;

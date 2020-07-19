import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import mime from 'mime/lite';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
import { inject, observer } from 'mobx-react/native';
import { Picker } from 'native-base';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import LoadingButton from '../components/LoadingButton';
import NumericInput from '../components/NumericInput';
import styles from '../styles';
import PhotoChoicer from './modals/ChoiceCameraRoll';

//import { ImageCacheManager } from 'react-native-cached-image';
@inject('store')
@observer
class MyAutoScreen extends React.Component {
    state = {
        imageNum: null,
        isOpen: null,
        types: [
            { name: 'Тип кузова', isOpen: null },
            { name: 'Рефрижератор (крытый)', isOpen: false },
            { name: 'Термобудка (крытый)', isOpen: false },
            { name: 'Кран. борт', isOpen: true },
            { name: 'Тент (крытый)', isOpen: false },
            { name: 'Открытый борт', isOpen: true },
        ],
        veh_stateCarNumber: '',
        colorMessage: 'red',
        vehicle0: null,
        vehicle1: null,
        vehicle2: null,
    };

    static navigationOptions = {
        title: 'Мое авто',
        headerLeft: null,
    };

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            (async () => {
                try {
                    await this.props.store.getUserInfo();
                    //await CacheManager.clearCache();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log(error);
                    console.log('Ошибка при получении новых данных, проверьте подключение к сети');
                    return;
                }

                this.setState({ ...this.props.store, message: '' });
                console.log('[MyAutoScreen].() this.props.store', this.state);
            })();
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

    _openModalImage = (num) => () => {
        this.setState({
            choiceModalVisible: true,
            imageNum: num,
        });
    };

    _pickFromCamera = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchCameraAsync({
                mediaTypes: 'Images',
                quality: 0.3,
            });
            if (!cancelled) this.setState({ [`vehicle${this.state.imageNum}`]: uri });
        }
    };

    _selectPicture = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                quality: 0.3,
            });
            if (!cancelled) this.setState({ [`vehicle${this.state.imageNum}`]: uri });
        }
    };

    _nextScreen = async () => {
        if (
            !this.state.vehicle0 ||
            !this.state.vehicle1 ||
            !this.state.vehicle2 ||
            this.state.veh_frameType === 'Тип кузова' ||
            this.state.veh_is_open === null ||
            this.state.veh_loadingCap === null ||
            this.state.veh_length === null ||
            this.state.veh_width === null ||
            this.state.veh_height === null ||
            !this.state.veh_stateCarNumber
        ) {
            this.setState({ message: 'Все поля должны быть заполнены', colorMessage: 'red' });
            return;
        }

        const id = await AsyncStorage.getItem('userId');

        try {
            const res = await axios.patch('/worker/' + id, {
                veh_is_open: this.state.veh_is_open,
                veh_height: this.state.veh_is_open ? '4' : this.state.veh_height,
                veh_width: this.state.veh_width,
                veh_length: this.state.veh_length,
                veh_loadingCap: this.state.veh_loadingCap,
                veh_frameType: this.state.veh_frameType,
                veh_stateCarNumber: this.state.veh_stateCarNumber,
            });

            console.log(res.data);
            const data = new FormData();

            this.state.vehicle0 &&
                data.append('vehicle0', {
                    uri: this.state.vehicle0,
                    type: mime.getType(this.state.vehicle0),
                    name: 'image.jpg',
                });

            this.state.vehicle1 &&
                data.append('vehicle1', {
                    uri: this.state.vehicle1,
                    type: mime.getType(this.state.vehicle1),
                    name: 'image.jpg',
                });

            this.state.vehicle2 &&
                data.append('vehicle2', {
                    uri: this.state.vehicle2,
                    type: mime.getType(this.state.vehicle2),
                    name: 'image.jpg',
                });
            //ImageCacheManager.clearCache();

            console.log(data);

            await axios.patch('/worker/upload/' + id, data);
            //await AsyncStorage.setItem("phoneNum", this.state.phone);
            this.setState({ message: 'Данные успешно сохранены', colorMessage: 'green' });
            await this.props.store.refreshImages();
            //this.props.navigation.navigate('EditCar');
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        return (
            <View>
                {!this.state.isDriver ? (
                    <View style={localStyles.notDriverContainer}>
                        <Text style={localStyles.notDriverText}>
                            Вы не являетесь водителем. Для того, чтобы изменять данные об автомобиле, измените
                            специальность на экране "Моя информация" с "Грузчика" на "Водителя"
                        </Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.registrationScreen}>
                        <Text style={{ color: this.state.colorMessage }}>{this.state.message}</Text>
                        <View style={styles.inputContainer}>
                            <View style={localStyles.dropdown}>
                                <Picker
                                    selectedValue={this.state.veh_frameType}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({
                                            veh_frameType: itemValue,
                                            veh_is_open: this.state.types[itemIndex].isOpen,
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
                                value={this.state.veh_stateCarNumber}
                                onChangeText={(veh_stateCarNumber) => this.setState({ veh_stateCarNumber })}
                            />
                            <NumericInput
                                style={styles.input}
                                placeholder="Грузоподъёмность (т)"
                                onChangeText={(veh_loadingCap) => this.setState({ veh_loadingCap })}
                                value={this.state.veh_loadingCap ? this.state.veh_loadingCap.toString() : ''}
                            />
                            <Text style={styles.descriptionTwo}>Кузов:</Text>
                            <NumericInput
                                style={styles.input}
                                placeholder="Длина (м)"
                                onChangeText={(veh_length) => this.setState({ veh_length })}
                                value={this.state.veh_length ? this.state.veh_length.toString() : ''}
                            />
                            <NumericInput
                                style={styles.input}
                                placeholder="Ширина (м)"
                                onChangeText={(veh_width) => this.setState({ veh_width })}
                                value={this.state.veh_width ? this.state.veh_width.toString() : ''}
                            />
                            {!this.state.veh_is_open && (
                                <NumericInput
                                    style={styles.input}
                                    placeholder="Высота (м)"
                                    onChangeText={(veh_height) => this.setState({ veh_height })}
                                    value={this.state.veh_height ? this.state.veh_height.toString() : ''}
                                />
                            )}
                            <Text style={styles.descriptionTwo}>Фотографии:</Text>
                            <View style={styles.photoButtonContainer}>
                                {[0, 1, 2].map((num) => (
                                    <PhotoChoicer
                                        key={`choicer${num}`}
                                        size={100}
                                        imageStyle={localStyles.photoChoicer}
                                        uri={this.state[`vehicle${num}`] || this.props.store[`vehicle${num}`]}
                                        refreshImage={this.props.store.refreshImage}
                                        onChange={(uri) => this.setState({ [`vehicle${num}`]: uri })}
                                    />
                                ))}
                            </View>
                        </View>

                        <LoadingButton style={styles.buttonBottom} onPress={this._nextScreen}>
                            СОХРАНИТЬ
                        </LoadingButton>
                    </ScrollView>
                )}
            </View>
        );
    }
}

const localStyles = StyleSheet.create({
    photoChoicer: { flex: 0, width: 100, height: 100 },
    dropdown: {
        height: 45,
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 5,
        marginBottom: 15,
        justifyContent: 'center',
    },
    notDriverContainer: {
        width: '90%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    notDriverText: { textAlign: 'center', fontSize: 16 },
});

export default MyAutoScreen;

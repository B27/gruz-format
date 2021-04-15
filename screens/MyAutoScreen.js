import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import mime from 'mime/lite';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import LoadingButton from '../components/LoadingButton';
import NumericInput from '../components/NumericInput';
import styles from '../styles';
import { logButtonPress, logError, logInfo, logScreenView } from '../utils/FirebaseAnalyticsLogger';
import showAlert from '../utils/showAlert';
import PhotoChoicer from './modals/ChoiceCameraRoll';

//import { ImageCacheManager } from 'react-native-cached-image';
const TAG = '~MyAutoScreen~';

@inject('store')
@observer
class MyAutoScreen extends React.Component {
    state = {
        imageNum: null,
        isOpen: null,
        types: [
            { name: 'Рефрижератор (крытый)', isOpen: false },
            { name: 'Термобудка (крытый)', isOpen: false },
            { name: 'Кран. борт', isOpen: true },
            { name: 'Тент (крытый)', isOpen: false },
            { name: 'Будка (крытый)', isOpen: false },
            { name: 'Открытый борт', isOpen: true },
        ],
        veh_stateCarNumber: '',
        colorMessage: 'red',
        vehicle0: null,
        vehicle1: null,
        vehicle2: null,
        veh0changed: false,
        veh1changed: false,
        veh2changed: false,
        veh_frameType: null,
        veh_is_open: null,
    };

    static navigationOptions = {
        title: 'Мое авто',
        headerLeft: null,
    };

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            logScreenView(TAG);
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

    _saveAutoInfo = async () => {
        logButtonPress({ TAG, info: 'save info about auto' });
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
            showAlert('Ошибка', 'Все поля должны быть заполнены');
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

            for (let i = 0; i < 3; i++) {
                this.state[`veh${i}changed`] &&
                    !!mime.getType(this.state[`vehicle${i}`]) &&
                    data.append(`vehicle${i}`, {
                        uri: this.state[`vehicle${i}`],
                        type: mime.getType(this.state[`vehicle${i}`]),
                        name: 'image.jpg',
                    });
            }

            if (data._parts.length > 0) {
                await axios.patch('/worker/upload/' + id, data);
            }
            this.setState({ message: 'Данные успешно сохранены', colorMessage: 'green' });
            await logInfo({ TAG, info: 'save info about auto' });
            showAlert('Успешно', 'Информация об авто сохранена');

            await this.props.store.refreshImages();
        } catch (error) {
            await logError({ TAG, error, info: 'save info about auto' });
            console.dir(error);
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
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        contentContainerStyle={styles.registrationScreen}
                    >
                        <Text style={{ color: this.state.colorMessage }}>{this.state.message}</Text>
                        <View style={styles.inputContainer}>
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
                                value={this.state.veh_frameType}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        veh_frameType: itemValue,
                                        veh_is_open: this.state.types[itemIndex - 1].isOpen,
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
                                        onChange={(uri) => {
                                            this.setState({ [`vehicle${num}`]: uri, [`veh${num}changed`]: true });
                                        }}
                                    />
                                ))}
                            </View>
                        </View>

                        <LoadingButton
                            style={styles.buttonBottom}
                            onPress={this._saveAutoInfo}
                            // eslint-disable-next-line react-native/no-raw-text
                        >
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

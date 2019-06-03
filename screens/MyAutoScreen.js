import { ImagePicker, Permissions } from 'expo';
import { Picker } from 'native-base';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View, AsyncStorage } from 'react-native';
import ImageChooser from '../components/ImageChooser';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';
import { inject, observer } from 'mobx-react/native';
import axios from 'axios';

import { CacheManager } from 'react-native-expo-image-cache';
//import { ImageCacheManager } from 'react-native-cached-image';
@inject('store')
@observer
class MyAutoScreen extends React.Component {
    state = {
        imageNum: null,
        choiceModalVisible: false,
        pictureUri: require('../images/camera.png'),

        isOpen: null,
        types: [
            { name: 'Тип кузова', isOpen: null },
            { name: 'Рефрижератор (крытый)', isOpen: false },
            { name: 'Термобудка (крытый)', isOpen: false },
            { name: 'Кран. борт', isOpen: true },
            { name: 'Тент (крытый)', isOpen: false }
        ],

        colorMessage: 'red'
    };

    static navigationOptions = {
        title: 'Мое авто',
        headerLeft: null
    };

    willFocusSubscription = null;

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            (async () => {
                try {
                    await this.props.store.getUserInfo();
                    //await CacheManager.clearCache();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log(error);
                    console.log('awdwadawdОшибка при получении новых данных, проверьте подключение к сети');
                    return;
                }

                this.setState({ ...this.props.store, message: '' });
            })();
        });
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
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
                    <Text style={{ color: this.state.colorMessage }}>{this.state.message}</Text>
                    <View style={styles.inputContainer}>
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
                                selectedValue={this.state.veh_frameType}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        veh_frameType: itemValue,
                                        veh_is_open: this.state.types[itemIndex].isOpen
                                    });
                                    console.log(itemValue, this.state.types[itemIndex].isOpen);
                                }}
                                placeholder='Тип кузова'
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
                            placeholder='Грузоподъёмность (тонны)'
                            placeholderTextColor='grey'
                            onChangeText={veh_loadingCap => this.setState({ veh_loadingCap })}
                            value={this.state.veh_loadingCap ? this.state.veh_loadingCap.toString() : ''}
                        />
                        <Text style={styles.descriptionTwo}>Кузов:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Длина'
                            placeholderTextColor='grey'
                            onChangeText={veh_length => this.setState({ veh_length })}
                            value={this.state.veh_length ? this.state.veh_length.toString() : ''}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Ширина'
                            placeholderTextColor='grey'
                            onChangeText={veh_width => this.setState({ veh_width })}
                            value={this.state.veh_width ? this.state.veh_width.toString() : ''}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Высота'
                            placeholderTextColor='grey'
                            onChangeText={veh_height => this.setState({ veh_height })}
                            value={this.state.veh_height ? this.state.veh_height.toString() : ''}
                        />
                        <Text style={styles.descriptionTwo}>Фотографии:</Text>
                        <View style={styles.photoButtonContainer}>
                            <ImageChooser openModal={this.openModalImage(0)} img={this.state.vehicle0} />
                            <ImageChooser openModal={this.openModalImage(1)} img={this.state.vehicle1} />
                            <ImageChooser openModal={this.openModalImage(2)} img={this.state.vehicle2} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.buttonBottom} onPress={this.nextScreen}>
                        <Text style={styles.text}>СОХРАНИТЬ</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    nextScreen = async () => {
        if (
            !this.state.vehicle0 ||
            !this.state.vehicle1 ||
            !this.state.vehicle2 ||
            this.state.veh_frameType === 'Тип кузова' ||
            this.state.veh_is_open === null ||
            this.state.veh_loadingCap === null ||
            this.state.veh_length === null ||
            this.state.veh_width === null ||
            this.state.veh_height === null
        ) {
            this.setState({ message: 'Все поля должны быть заполнены', colorMessage: 'red' });
        } else {
            const id = await AsyncStorage.getItem('userId');
            try {
                const res = await axios.patch('/worker/' + id, {
                    veh_is_open: this.state.veh_is_open,
                    veh_height: this.state.veh_height,
                    veh_width: this.state.veh_width,
                    veh_length: this.state.veh_length,
                    veh_loadingCap: this.state.veh_loadingCap,
                    veh_frameType: this.state.veh_frameType
                });

                console.log(res.data);
                const data = new FormData();
                console.log('PHOTOOOOOOOS: ', this.state.vehicle0, this.state.vehicle1, this.state.vehicle2);

                data.append('vehicle0', {
                    uri: this.state.vehicle0,
                    type: 'image/jpeg',
                    name: 'image.jpg'
                });
                data.append('vehicle1', {
                    uri: this.state.vehicle1,
                    type: 'image/jpeg',
                    name: 'image.jpg'
                });
                data.append('vehicle2', {
                    uri: this.state.vehicle2,
                    type: 'image/jpeg',
                    name: 'image.jpg'
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
        }
    };

    closeModals = () => {
        this.setState({
            choiceModalVisible: false
        });
    };

    openModalImage = num => () => {
        this.setState({
            choiceModalVisible: true,
            imageNum: num
        });
    };

    pickFromCamera = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchCameraAsync({
                mediaTypes: 'Images'
            });
            if (!cancelled) this.setState({ [`vehicle${this.state.imageNum}`]: uri });
        }
    };

    selectPicture = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',

                allowsEditing: true
            });
            if (!cancelled) this.setState({ [`vehicle${this.state.imageNum}`]: uri });
        }
    };
}

export default MyAutoScreen;

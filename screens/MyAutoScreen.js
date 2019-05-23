import { ImagePicker, Permissions } from 'expo';
import { Picker } from 'native-base';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImageChooser from '../components/ImageChooser';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';

class MyAutoScreen extends React.Component {
    state = {
        imageNum: null,
        choiceModalVisible: false,
        pictureUri: require('../images/camera.png'),
        bodyType: null,
        isOpen: null,
        types: [
            { name: 'Тип кузова', isOpen: null },
            { name: 'Рефрижератор (крытый)', isOpen: false },
            { name: 'Термобудка (крытый)', isOpen: false },
            { name: 'Кран. борт', isOpen: true },
            { name: 'Тент (крытый)', isOpen: false }
        ],
        loadCapacity: null,
        length: null,
        width: null,
        height: null
    };

    static navigationOptions = {
        title: 'Мое авто',
        headerLeft: null
    };

    render() {
        return (
            <KeyboardAvoidingView style={styles.flex1} contentContainerStyle={styles.flex1} behavior='padding'>
                <ScrollView contentContainerStyle={styles.registrationScreen}>
                    <ChoiceCameraRoll
                        pickFromCamera={this.pickFromCamera}
                        selectPicture={this.selectPicture}
                        visible={this.state.choiceModalVisible}
                        closeModal={this.closeModals}
                    />
                    <Text>{this.state.message}</Text>
                    <View style={styles.inputContainer} behavior='padding' enabled>
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
                                selectedValue={this.state.bodyType}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        bodyType: itemValue,
                                        isOpen: this.state.types[itemIndex].isOpen
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
                            onChangeText={loadCapacity => this.setState({ loadCapacity })}
                        />
                        <Text style={styles.descriptionTwo}>Кузов:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Длина'
                            placeholderTextColor='grey'
                            onChangeText={length => this.setState({ length })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Ширина'
                            placeholderTextColor='grey'
                            onChangeText={width => this.setState({ width })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Высота'
                            placeholderTextColor='grey'
                            onChangeText={height => this.setState({ height })}
                        />
                        <Text style={styles.descriptionTwo}>Фотографии:</Text>
                        <View style={styles.photoButtonContainer}>
                            <ImageChooser openModal={this.openModalImage(1)} img={this.state.image1} />
                            <ImageChooser openModal={this.openModalImage(2)} img={this.state.image2} />
                            <ImageChooser openModal={this.openModalImage(3)} img={this.state.image3} />
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
            !this.state.image1 ||
            !this.state.image2 ||
            !this.state.image3 ||
            this.state.bodyType === 'Тип кузова' ||
            this.state.isOpen === null ||
            this.state.loadCapacity === null ||
            this.state.length === null ||
            this.state.width === null ||
            this.state.height === null
        ) {
            this.setState({ message: 'Все поля должны быть заполнены' });
        } else {
            const id = await AsyncStorage.getItem('userId');
            await axios
                .patch('/worker/' + id, {
                    veh_is_open: this.state.isOpen,
                    veh_height: this.state.height,
                    veh_width: this.state.width,
                    veh_length: this.state.length,
                    veh_loadingCap: this.state.loadCapacity,
                    veh_frameType: this.state.bodyType
                })
                .catch(err => {
                    console.log(err);
                })
                .then(res => {
                    console.log(res.data);
                    //await AsyncStorage.setItem("phoneNum", this.state.phone);
                    this.props.navigation.navigate('EditCar');
                });

            const data = new FormData();
            console.log(this.state.pictureUri);

            data.append('pass', {
                uri: this.state.firstPageUri,
                type: 'image/jpeg',
                name: 'image.jpg'
            });
            data.append('pass_reg', {
                uri: this.state.secondPageUri,
                type: 'image/jpeg',
                name: 'image.jpg'
            });

            console.log(data);

            await axios.patch('/worker/upload/' + id, data);
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
            if (!cancelled) this.setState({ [`image${this.state.imageNum}`]: uri });
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
            if (!cancelled) this.setState({ [`image${this.state.imageNum}`]: uri });
        }
    };
}

export default MyAutoScreen;

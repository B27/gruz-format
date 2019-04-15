import React from 'react';
import {
    View,
    ScrollView,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native';
import styles from '../styles'
import LocalImage from '../components/LocalImage'
import { Permissions } from 'expo';

class EditUserScreen extends React.Component {
    
    componentDidMount() {
        this.checkPermissions();
    }
    state = {
        lastname: '',
        firstname: '',
        patronimyc: '',
        birthDate: '',
        address: '',
        height: '',
        weight: '',
        message: ''
    };
    static navigationOptions = {
        title: 'Регистрация',
        headerLeft: null,
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow: 1,
            alignSelf: 'center',
        },
    };//style={styles.registrationPhoto}
    
    checkPermissions = async ()=> {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            this.setState({message: 'Вам нужно дать разрешение'});
        } else this.setState({message: 'Все норм'}); 
               }
    render() {
        return (
            <ScrollView contentContainerStyle={styles.registrationScreen}>
                <TouchableOpacity style={styles.registrationPhotoContainer}>
                    <LocalImage  
                        source={require('../images/unknown.png')}
                        originalWidth = {909}
                        originalHeight = {465} 
                    />
                </TouchableOpacity>
                <Text>{this.state.message}</Text>
                <View style={styles.inputContainer} behavior="padding" enabled>
                
                    <TextInput
                        style={styles.input}
                        placeholder="Имя"
                        placeholderTextColor="grey"
                        onChangeText={(firstname) => this.setState({ firstname })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Фамилия"
                        placeholderTextColor="grey"
                        onChangeText={(lastname) => this.setState({ lastname })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Отчество"
                        placeholderTextColor="grey"
                        onChangeText={(patronimyc) => this.setState({ patronimyc })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Город"
                        placeholderTextColor="grey"
                        onChangeText={(lastname) => this.setState({ lastname })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Улица"
                        placeholderTextColor="grey"
                        onChangeText={(lastname) => this.setState({ lastname })}
                    />
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TextInput
                            style={styles.inputHalf}
                            placeholder="Дом"
                            placeholderTextColor="grey"
                            onChangeText={(lastname) => this.setState({ lastname })}
                        />
                        <View style={{ width: 15 }} />
                        <TextInput
                            style={styles.inputHalf}
                            placeholder="Квартира"
                            placeholderTextColor="grey"
                            onChangeText={(lastname) => this.setState({ lastname })}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Дата рождения"
                        placeholderTextColor="grey"
                        onChangeText={(birthDate) => this.setState({ birthDate })}
                    />
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TextInput
                            style={styles.inputHalf}
                            placeholder="Рост"
                            placeholderTextColor="grey"
                            onChangeText={(lastname) => this.setState({ lastname })}
                        />
                        <View style={{ width: 15 }} />
                        <TextInput
                            style={styles.inputHalf}
                            placeholder="Вес"
                            placeholderTextColor="grey"
                            onChangeText={(lastname) => this.setState({ lastname })}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.buttonBottom} onPress={() => this._nextScreen()}>
                    <Text style={styles.text} >ПРОДОЛЖИТЬ</Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }
    _nextScreen = () => {
        this.props.navigation.navigate('Documents');
    }
}


export default EditUserScreen;


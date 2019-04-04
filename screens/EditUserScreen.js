import React from 'react';
import {
    View,
    ScrollView,
    TextInput,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from '../styles'

class EditUserScreen extends React.Component {

    state = {
        lastname: '',
        firstname: '',
        patronimyc: '',
        birthDate: '',
        address: '',
        height: '',
        weight: ''
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

    render() {
        return (
            <ScrollView contentContainerStyle={styles.registrationScreen}>
                
                <View style={styles.inputContainer} behavior="padding" enabled>
                <TouchableOpacity>
                    <Image style={styles.registrationPhoto} source={require('../images/unknown.png')} />
                </TouchableOpacity>
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

                <TouchableOpacity style={styles.buttonBottom} onPress={() => this._signInAsync()}>
                    <Text style={styles.text} >ПРОДОЛЖИТЬ</Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }
}


export default EditUserScreen;


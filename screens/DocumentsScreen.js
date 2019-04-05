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
import LocalImage from '../components/LocalImage'
import Icon from 'react-native-vector-icons/MaterialIcons' 

class DocumentsScreen extends React.Component {

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
    };//style={styles.registrationPhoto}

    render() {
        return (
            <ScrollView contentContainerStyle={styles.registrationScreen}>
                
                <View style={styles.inputContainer} behavior="padding" enabled>
                
                    <TextInput
                        style={styles.input}
                        placeholder="Номер паспорта"
                        placeholderTextColor="grey"
                        onChangeText={(firstname) => this.setState({ firstname })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Серия паспорта"
                        placeholderTextColor="grey"
                        onChangeText={(lastname) => this.setState({ lastname })}
                    />
                    <TouchableOpacity style={styles.camButton}>
                        <Icon name={'photo-library'} size={28} color="black" style={styles.buttonIcon} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Номер договора"
                        placeholderTextColor="grey"
                        onChangeText={(patronimyc) => this.setState({ patronimyc })}
                    />

                </View>

                <TouchableOpacity style={styles.buttonBottom} onPress={() => this._signInAsync()}>
                    <Text style={styles.text} >ПРОДОЛЖИТЬ</Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }
}


export default DocumentsScreen;


import React from 'react';
import { Text } from 'react-native';

// class LogoTitle extends React.Component {
//     render() {
//         return(
//             <Text style={{ width: '100%', textAlign: 'center'}}>Регистрация</Text>
//         )
//     }
// }
//запретить идти назад
class EditUserScreen extends React.Component {

    static navigationOptions = {
        title:'Регистрация',
        headerLeft: null,
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
    };

    render() {
        return (
                <Text>EDIT USER SCREEN</Text>

        );
    }
}


export default EditUserScreen;


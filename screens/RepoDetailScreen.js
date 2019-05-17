import React, { Component } from 'react';
import { View, Button, AsyncStorage } from 'react-native';


import { username } from '../constants';

class RepoDetailScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'RepoDetail',
    title: 'RepoDetail'
  };

  render() {

    return (
      <View>
        <Button title="Выйти из аккаунта" onPress={() => this._signOutAsync()} />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}



export default RepoDetailScreen;
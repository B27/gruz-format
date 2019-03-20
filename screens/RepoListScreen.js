import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';
import { username } from '../constants';

import { listRepos } from './reducer';

class RepoListScreen extends React.Component {
  static navigationOptions = {
    title: 'Груз-формат'
  };

  componentDidMount() {
    this.props.listRepos(username);//вместо dispatch
  }
  renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => this.props.navigation.navigate('Detail', { name: item.name })}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  render() {
    const { repos } = this.props;
    return (
      <FlatList
        styles={styles.container}
        data={repos}
        renderItem={this.renderItem}
        keyExtractor={ (item, index) => index.toString() }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});

const mapStateToProps = state => {
  let storedRepositories = state.repos.map(repo => ({key: repo.id, ...repo}));
  return {
    repos: storedRepositories
  };
};

const mapDispatchToProps = {
  listRepos
};

export default connect(mapStateToProps, mapDispatchToProps)(RepoListScreen);

import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default class LoadingButton extends React.Component {
    state = {
        loading: false
    };

    _onPress = async () => {
        this.setState({ loading: true });
        try {
            await this.props.onPress();
        } catch (error) {
            this.setState({ loading: false });
        }
    };

    render() {
        const { style, children } = this.props;
        return (
            <TouchableOpacity style={style} onPress={this._onPress} disabled={this.state.loading}>
                {this.state.loading ? (
                    <ActivityIndicator style={{ flex: 1 }} color='grey' />
                ) : (
                    <Text style={styles.text}>{children}</Text>
                )}
            </TouchableOpacity>
        );
    }
}

import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default class LoadingButton extends React.Component {
    state = {
        loading: false,
        update: true
    };

    // в onPress может быть переход в другой стек и unmount всех компонентов
    // setState на отмонтированном компоненте вызывает утечку памяти
    // для этого необходимо отключить его вызов
    offButtonSetState = () => {
        this.setState({ update: false });
    };

    _onPress = async () => {
        this.setState({ loading: true });

        await this.props.onPress(this.offButtonSetState);

        if (this.state.update) {
            this.setState({ loading: false });
        }
    };

    render() {
        const { style, children, yellowButton } = this.props;
        return (
            <TouchableOpacity style={style} onPress={this._onPress} disabled={this.state.loading}>
                {this.state.loading ? (
                    <ActivityIndicator style={{ flex: 1 }} color='grey' />
                ) : (
                    <Text style={yellowButton ? styles.buttonText : styles.text}>{children}</Text>
                )}
            </TouchableOpacity>
        );
    }
}

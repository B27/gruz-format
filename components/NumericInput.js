import React from 'react';
import { TextInput } from 'react-native';
export default class NumericInput extends React.Component {
    _onChangeText = text => {
        if (this.props.onlyNum && (text.includes(',') || text.includes('.'))) {
            return;
        }

        if (text.includes(',')) {
            return;
        }

        // отрезаю число до сотых и проверяю наличие двух точек
        if (-1 < text.search(/\....|\..*\./)) {
            return;
        }

        this.props.onChangeText(text);
    };

    render() {
        const { style, placeholder, value } = this.props;
        return (
            <TextInput
                style={style}
                placeholder={placeholder}
                placeholderTextColor='grey'
                keyboardType='numeric'
                onChangeText={this._onChangeText}
                value={value}
            />
        );
    }
}

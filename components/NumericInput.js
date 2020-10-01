import React, { useRef, useCallback } from 'react';
import { TextInput } from 'react-native';

export default function DecimalInput({ onlyNum, onChangeText, style, placeholder, value }) {
    const _onChangeText = useCallback(
        (text) => {
            if (onlyNum && (text.includes(',') || text.includes('.'))) {
                return;
            }

            const inputStr = text.replace(',', '.');

            // отрезаю число до сотых и проверяю наличие двух точек
            if (inputStr.search(/\....|\..*\./) > -1) {
                return;
            }

            onChangeText(inputStr);
        },
        [onChangeText, onlyNum],
    );

    return (
        <TextInput
            style={style}
            placeholder={placeholder}
            placeholderTextColor="grey"
            keyboardType="numeric"
            onChangeText={_onChangeText}
            value={value}
        />
    );
}

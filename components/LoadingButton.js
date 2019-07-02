import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function LoadingButton({ style, children, blackText, onPress }) {
    let [loading, setLoading] = useState(false);

    let update = useRef(true);

    useEffect(() => {
        return () => (update = false);
    }, []);

    const _onPress = useCallback(async () => {
        setLoading(true);
        await onPress();
        if (update.current) {
            setLoading(false);
        }
    }, []);

    return (
        <TouchableOpacity style={style} onPress={_onPress} disabled={loading}>
            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} color='grey' />
            ) : (
                <Text style={blackText ? styles.buttonText : styles.text}>{children}</Text>
            )}
        </TouchableOpacity>
    );
}

import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
const placeholder = require('../../images/unknown.png');

function PhotoChoicer({ onChange, size, uri, refreshImage, containerStyle, imageStyle }) {
    const _handleImagePickerResponse = useCallback(
        async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.error('error in select image');
            } else {
                onChange(response.uri);
                // await _cropImage(response.uri);
            }
        },
        [onChange],
    );

    const _onPressSelectImage = useCallback(async () => {
        ImagePicker.launchImageLibrary(
            {
                noData: true,
                quality: 0.5,
            },
            _handleImagePickerResponse,
        );
    }, [_handleImagePickerResponse]);

    const _renderImage = useMemo(
        () => (
            <Image
                style={[localStyles.image, imageStyle]}
                source={{
                    uri: `${uri}?${refreshImage}`,
                }}
                resizeMode="cover"
            />
        ),
        [imageStyle, uri, refreshImage],
    );

    const _renderPlaceholder = useMemo(
        () => (
            <Image
                style={{
                    width: size,
                    height: size,
                }}
                source={placeholder}
                resizeMode="cover"
            />
        ),
        [size],
    );

    return (
        <>
            <View style={[localStyles.container, { height: size }, containerStyle]}>
                <TouchableOpacity onPress={_onPressSelectImage} style={localStyles.touchableOpacity}>
                    {uri ? _renderImage : _renderPlaceholder}
                </TouchableOpacity>
            </View>
        </>
    );
}

const localStyles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 24,
    },
    image: {
        flex: 1,
        alignSelf: 'stretch',
        borderRadius: 15,
    },
    touchableOpacity: {
        flex: 1,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PhotoChoicer;

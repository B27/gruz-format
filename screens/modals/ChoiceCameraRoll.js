import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
const placeholder = require('../../images/unknown.png');

function PhotoChoicer({ size, state, field }) {
    const [photo, setPhoto] = useState(null);

    const _handleImagePickerResponse = useCallback(
        async response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.error('error in select image');
            } else {
                console.log(response, 'imagepicker');
                state[field] = response.uri; //.replace('///', '/');
                setPhoto(response.uri);

                // await _cropImage(response.uri);
            }
        },
        [field, state],
    );

    const _onPressSelectImage = useCallback(async () => {
        ImagePicker.showImagePicker(
            {
                title: null,
                cancelButtonTitle: 'Отмена',
                takePhotoButtonTitle: 'Сделать фото',
                chooseFromLibraryButtonTitle: 'Выбрать из галереи',
                permissionDenied: {
                    title: 'Разрешения не предоставлены',
                    text: 'Для загрузки фотографии необходимо предоставить разрешения',
                    reTryTitle: 'Разрешить',
                    okTitle: 'Понятно',
                },
                noData: true,
                storageOptions: {
                    skipBackup: true,
                    privateDirectory: true,
                },
                quality: 0.5,
            },
            _handleImagePickerResponse,
        );
    }, [_handleImagePickerResponse]);

    const _renderImage = useMemo(
        () => (
            <Image
                style={localStyles.image}
                // style={[styles.image, { flex: 1,  width: size, height: size, borderWidth: 2, borderColor: 'black' }]}
                source={{
                    uri: photo, //`data:${store[storeView](index).mime};base64,${store[storeView](index).base64}`,
                }}
                resizeMode="cover"
            />
        ),
        [photo],
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
            <View style={[localStyles.container, { height: size }]}>
                <TouchableOpacity onPress={_onPressSelectImage} style={localStyles.touchableOpacity}>
                    {photo ? _renderImage : _renderPlaceholder}
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
        marginHorizontal: 8,
    },
    image: {
        flex: 1,
        alignSelf: 'stretch',
    },
    touchableOpacity: {
        flex: 1,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PhotoChoicer;

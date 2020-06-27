import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import styles from '../../styles';

class ChoiceCameraRoll extends React.Component {
    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.props.closeModal();
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                    }}
                >
                    <View style={styles.choiceCameraRoll}>
                        <TouchableOpacity style={styles.choiceCameraRollItem} onPress={this.props.pickFromCamera}>
                            <Text style={styles.blackText}>Сделать фото...</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.choiceCameraRollItem} onPress={this.props.selectPicture}>
                            <Text style={styles.blackText}>Выбрать из галереи...</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.choiceCameraRollCancel}
                            onPress={() => {
                                this.props.closeModal();
                            }}
                        >
                            <Text style={styles.text}>Отменить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

function PhotoChoicer({ store, onChoiceImage, onDeleteImage, index, storeView, size }) {
    const [photo, setPhoto] = useState();

    const _handleImagePickerResponse = useCallback(async response => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('error in select image');
        } else {
            console.log(response, 'imagepicker');

            setPhoto(response.uri);
            // await _cropImage(response.uri);
        }
    }, []);

    const _onPressSelectImage = useCallback(async () => {
        ImagePicker.showImagePicker(
            {
                title: null,
                // customButtons: store[storeView](index) ? [{ name: 'delete', title: $T.delete }] : undefined,
                // cancelButtonTitle: $T.cancel,
                // takePhotoButtonTitle: $T.take_photo,
                // chooseFromLibraryButtonTitle: $T.choose_from_gallery,
                // permissionDenied: {
                //     title: $T.permission_denied,
                //     text: $T.need_permissions,
                //     reTryTitle: $T.allow,
                //     okTitle: $T.understandably,
                // },
                noData: true,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            },
            _handleImagePickerResponse,
        );
    }, [_handleImagePickerResponse, index, store, storeView]);

    const _renderImage = useMemo(
        () => (
            <Image
                style={[styles.image, { width: size, height: size }]}
                source={
                    photo && {
                        uri: photo, //`data:${store[storeView](index).mime};base64,${store[storeView](index).base64}`,
                    }
                }
                resizeMode="cover"
            />
        ),
        [index, photo, size, store, storeView],
    );

    const _renderPlaceholder = useMemo(
        () => (
            <View style={styles.placeholder}>
                <IconFontello style={styles.icon} name="add-photo" size={36} />
            </View>
        ),
        [],
    );

    return (
        <>
            <View style={[styles.container, { width: size, height: size }]}>
                {photo ? _renderImage : _renderPlaceholder}
                {/* <RectButton
                    onPress={_onPressSelectImage}
                    rippleColor={colors.modalButtons}
                    underlayColor={colors.modalButtons}
                    style={StyleSheet.absoluteFill}
                /> */}
            </View>
        </>
    );
}

export default ChoiceCameraRoll;

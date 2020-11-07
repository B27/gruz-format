import React, { Component } from 'react';
import { Image, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import store from '../mobx/Store';

const LocalImage = observer(({ source, originalWidth, originalHeight }) => {
    const { width: windowWidth } = Dimensions.get('window');
    let widthChange = (windowWidth - 50) / originalWidth;
    let newWidth = originalWidth * widthChange;
    let newHeight = originalHeight * widthChange;
    console.log('КАРТИНКА ОБНОВИЛАСЬ: ' + source + '?' + store.refreshImage);
    console.log();
    if (typeof source === 'number') {
        return <Image source={source} style={{ width: newWidth, height: newHeight }} />;
    } else {
        return (
            <Image source={{ uri: source + '?' + store.refreshImage }} style={{ width: newWidth, height: newHeight }} />
        );
    }
});

export default LocalImage;

import React, { Fragment } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpandCardBase from './ExpandCardBase';
import styles from '../styles';

class OrderCard extends React.Component {
    _onPressButton = () => {
        this.props.onPressButton(this.props.id);
    };

    render() {
        const { cardStyle, buttonName, description, addresses, time, id, expandAlways, fullAddress } = this.props;

        return (
            <ExpandCardBase
                expandAlways={expandAlways}
                buttonName={buttonName}
                cardStyle={[styles.cardBase, cardStyle]}
                id={id}
                OpenComponent={
                    <Fragment>
                        <View style={styles.orderRow}>
                            <Icon name='clock-outline' color='#FFC234' size={20} style={styles.orderIcon} />
                            <Text style={styles.clockText}>{formatDate(time)}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Icon name='map-marker' color='#FFC234' size={20} style={styles.orderIcon} />
                            <View>
                                {addresses.map((location, index) => {
                                    return (
                                        <Fragment key={index + 'a'}>
                                            <Text
                                                style={styles.locationPointNameText}
                                                key={index + 'b'}
                                            >{`Пункт ${String.fromCharCode(
                                                0x0410 + index // 0x0410 - код русской буквы А в Unicode
                                            )}: `}</Text>
                                            <Text style={styles.locationText} key={index + 'c'}>
                                                {generateAddress(location, fullAddress)}
                                            </Text>
                                            <Text key={index + 'd'} />
                                        </Fragment>
                                    );
                                })}
                            </View>
                        </View>
                    </Fragment>
                }
                HiddenComponent={
                    <Fragment>
                        <View style={styles.orderRow}>
                            <Icon name='message-text' color='#FFC234' size={20} style={styles.orderIcon} />
                            <Text style={styles.descriptionText}>{description}</Text>
                        </View>
                        {buttonName && (
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.cardButton} onPress={this._onPressButton}>
                                    <Text style={styles.cardButtonText}>{buttonName}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Fragment>
                }
            />
        );
    }
}

function generateAddress(location, fullAddress) {
    let address = location.address;
    if (fullAddress) {
        if (location.entrance) address += `, подъезд ${location.entrance}`;
        if (location.apartment) address += `, кв. ${location.apartment}`;
    }
    return address;
}

const regExp = /^(\d{4}?)-(\d{2}?)-(\d{2}?)T(\d{2}?):(\d{2}?)(?:.+)$/;

function formatDate(date) {
    return date.replace(regExp, '$3.$2.$1 $4:$5');
}

export default OrderCard;

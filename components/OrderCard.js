import React, { Fragment } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpandCardBase from './ExpandCardBase';
import styles from '../styles';
import moment from 'moment';
import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
class OrderCard extends React.Component {
    _onPressButton = () => {
        this.props.onPressButton(this.props.order);
    };

    render() {
        const {
            orderType,
            cardStyle,
            buttonName,
            description,
            addresses = [],
            time,
            order,
            expandAlways,
            fullAddress,
        } = this.props;
        let orderId = order ? order._id : 'id';
        return (
            <ExpandCardBase
                expandAlways={expandAlways}
                buttonName={buttonName}
                cardStyle={[styles.cardBase, cardStyle]}
                id={orderId}
                OpenComponent={
                    <Fragment>
                        <View style={styles.orderRow}>
                            <Icon name="clock-outline" color="#FFC234" size={20} style={styles.orderIcon} />
                            <Text style={styles.textInput}>{formatDate(time)}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Icon name="account-multiple" color="#FFC234" size={20} style={styles.orderIcon} />
                            <Text style={styles.clockText}>{orderType}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Icon name="map-marker" color="#FFC234" size={20} style={styles.orderIcon} />
                            <View>
                                {addresses.map((location, index) => {
                                    return (
                                        <Fragment key={index + 'a'}>
                                            <Text
                                                style={styles.locationPointNameText}
                                                key={index + 'b'}
                                            >{`Пункт ${String.fromCharCode(
                                                0x0410 + index, // 0x0410 - код русской буквы А в Unicode
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
                            <Icon name="message-text" color="#FFC234" size={20} style={styles.orderIcon} />
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

function formatDate(date) {
    return moment(date).format('DD.MM.YY HH:mm');
}

export default OrderCard;

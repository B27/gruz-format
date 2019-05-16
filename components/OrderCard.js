import React, { Fragment } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpandCardBase from './ExpandCardBase';
import styles from '../styles';

class OrderCard extends React.Component {
    _onPressButton = () => {
        this.props.onPressButton(this.props.id);
    };

    // судя по ТЗ переход в подробную информация на кнопку Принять
    // _onPressCard = () => {
    //     this.props.onPressCard(this.props.id);
    // };

    render() {
        const { cardStyle, buttonName, description, address, time, id, expandAlways } = this.props;
        return (
            <ExpandCardBase
                expandAlways={expandAlways}
                buttonName={buttonName}
                cardStyle={[styles.orderBase, cardStyle]}
                id={id}
                OpenComponent={
                    <Fragment>
                        <View style={styles.orderRow}>
                            <Icon name='clock-outline' color='#FFC234' size={20} style={styles.orderIcon} />
                            <Text style={styles.clockText}>{time}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Icon name='map-marker' color='#FFC234' size={20} style={styles.orderIcon} />
                            <Text style={styles.locationText}>{address}</Text>
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
                                    <Text style={styles.buttonText}>{buttonName}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Fragment>
                }
            />
        );
    }
}

export default OrderCard;

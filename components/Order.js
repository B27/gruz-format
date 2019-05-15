import React, { Fragment } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/OrderStyle';

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderExpanded: false
        };
    }

    _pressExpand = () => {
        this.setState({
            orderExpanded: !this.state.orderExpanded
        });
    };

    _onPressButton = () => {
        this.props.onPressButton(this.props.id);
    };

    // судя по ТЗ переход в подробную информация на кнопку Принять
    // _onPressCard = () => {
    //     this.props.onPressCard(this.props.id);
    // };

    render() {
        const { orderExpanded } = this.state;
        const { style, buttonName, description, address, time, id, expandAlways } = this.props;
        return (
            <TouchableOpacity
                style={[styles.orderBase, style]}
                key={id}
                onPress={expandAlways ? undefined : this._pressExpand}
                // onPress срабатывает сразу после корректного нажатия,
                // но для того чтобы появилась анимация прозрачности необходимо держать компонент нажатым 10 секунд
                delayPressIn={10000}
            >
                <View>
                    <View style={styles.orderRowTopContainer}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.orderRow}>
                                <Icon name='clock-outline' color='#FFC234' size={20} style={styles.orderIcon} />
                                <Text style={styles.clockText}>{time}</Text>
                            </View>
                            <View style={styles.orderRow}>
                                <Icon name='map-marker' color='#FFC234' size={20} style={styles.orderIcon} />
                                <Text style={styles.locationText}>{address}</Text>
                            </View>
                        </View>
                        {expandAlways || (
                            <TouchableOpacity onPress={this._pressExpand}>
                                {orderExpanded ? (
                                    <Icon name='chevron-up' size={42} color='#c4c4c4' style={styles.orderChevronIcon} />
                                ) : (
                                    <Icon
                                        name='chevron-down'
                                        size={42}
                                        color='#c4c4c4'
                                        style={styles.orderChevronIcon}
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    {(orderExpanded || expandAlways) && (
                        <Fragment>
                            <View style={styles.orderRow}>
                                <Icon name='message-text' color='#FFC234' size={20} style={styles.orderIcon} />
                                <Text style={styles.descriptionText}>{description}</Text>
                            </View>
                            {buttonName && (
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={styles.button} onPress={this._onPressButton}>
                                        <Text style={styles.buttonText}>{buttonName}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Fragment>
                    )}
                </View>
            </TouchableOpacity>
        );
    }
}

export default Order;

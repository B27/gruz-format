import { inject, observer } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import ExpandCardBase from '../components/ExpandCardBase';
import OrderCard from '../components/OrderCard';
import styles from '../styles';

@inject('store')
@observer
class OrderCompleteScreen extends React.Component {
    static navigationOptions = {
        title: 'Завершение заказа'
    };

    render() {
        const { workers: workersObservable, order, dispatcher } = this.props.store;

        const workers = workersObservable.slice();

        const driver = workers.find(worker => worker.isDriver);
        const movers = workers.filter(worker => !worker.isDriver);
        return (
            <Fragment>
                <ScrollView>
                    <OrderCard
                        fullAddress
                        expandAlways
                        time={order.start_time}
                        addresses={order.locations}
                        description={order.comment}
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
                        expandAlways
                        OpenComponent={<Text style={styles.cardExecutorH2}>Исполнители</Text>}
                        HiddenComponent={
                            <Fragment>
                                <View style={styles.cardDescription}>
                                    {dispatcher && (
                                        <View>
                                            <Text style={styles.executorTextDisp}>Диспетчер:</Text>
                                            <View style={styles.executorsRow}>
                                                <View>
                                                    <IconCam
                                                        name={'camera'}
                                                        color={'#FFC234'}
                                                        size={50}
                                                        style={styles.orderIcon}
                                                    />
                                                </View>
                                                <View>
                                                    <Text>{dispatcher.name}</Text>
                                                    <Text>{dispatcher.phoneNum}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    {driver && (
                                        <View>
                                            <Text style={styles.executorText}>Водитель:</Text>
                                            <View style={styles.executorsRow}>
                                                <View>
                                                    {driver.avatar ? (
                                                        <Image
                                                            style={styles.executorImage}
                                                            source={{ uri: driver.avatar }}
                                                        />
                                                    ) : (
                                                        <IconCam
                                                            name={'camera'}
                                                            color={'#FFC234'}
                                                            size={50}
                                                            style={styles.orderIcon}
                                                        />
                                                    )}
                                                </View>
                                                <View>
                                                    <Text>{driver.name}</Text>
                                                    <Text>{driver.phoneNum}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    {movers && (
                                        <View>
                                            <Text style={styles.executorText}>
                                                {movers.length > 1 ? 'Грузчики:' : 'Грузчик'}
                                            </Text>
                                            {movers.map(mover => (
                                                <View key={mover.id} style={styles.executorsRow}>
                                                    <View>
                                                        {mover.avatar ? (
                                                            <Image
                                                                style={styles.executorImage}
                                                                source={{ uri: mover.avatar }}
                                                            />
                                                        ) : (
                                                            <IconCam
                                                                name={'camera'}
                                                                color={'#FFC234'}
                                                                size={50}
                                                                style={styles.orderIcon}
                                                            />
                                                        )}
                                                    </View>
                                                    <View>
                                                        <Text>{mover.name}</Text>
                                                        <Text>{mover.phoneNum}</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </Fragment>
                        }
                        cardStyle={[styles.cardMargins, styles.spaceBottom]}
                    />
                </ScrollView>
                <View style={styles.absoluteButtonContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={this._cancelPress}>
                            <Text style={styles.buttonText}>ОТМЕНА</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={this._confirmPress}>
                            <Text style={styles.buttonText}>ГОТОВО</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }

    _cancelPress = () => {
        this.props.navigation.goBack();
    };

    _confirmPress = () => {
        this.props.navigation.navigate('Main');
    };

    _chatPress = () => {
        this.props.navigation.navigate('OrderChat');
    };
}

export default OrderCompleteScreen;

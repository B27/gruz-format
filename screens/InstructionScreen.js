import React, { Fragment } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';

class InstructionScreen extends React.Component {
    state = {
        moverView: false,
        driverView: false
    };

    static navigationOptions = {
        title: 'Информация'
    };

    pressMover = () => {
        this.setState({
            moverView: !this.state.moverView
        });
    };
    pressDriver = () => {
        this.setState({
            driverView: !this.state.driverView
        });
    };

    render() {
        const { moverView, driverView } = this.state;
        return (
            <ScrollView>
                {/* Грузчик */}
                <View style={styles.instructionBase}>
                    <View style={styles.instructionView}>
                        <TouchableOpacity style={styles.instructionViewTitle} onPress={this.pressMover}>
                            <Text style={styles.instructionTitle}>Грузчик</Text>
                            {moverView ? (
                                <Icon name='ios-arrow-up' size={42} color={'#d3d3d3'} />
                            ) : (
                                <Icon name='ios-arrow-down' size={42} color={'#d3d3d3'} />
                            )}
                        </TouchableOpacity>
                        {moverView && (
                            <Fragment>
                                <ScrollView>
                                    <Text style={styles.instructionText}>
                                        По старой традиции торжественный парад, посвящённый в этом году 74-годовщине
                                        Победы в Великой Отечественной войне, начался в десять часов утра. Посмотреть на
                                        пешие колонны и военную технику на площадь Советов пришли тысячи жителей
                                        Улан-Удэ и гостей столицы. На главной трибуне города почётные места заняли
                                        ветераны и труженики тыла. Перед военнослужащими и зрителями с поздравительной
                                        речью выступил командующий общевойсковым объединением генерал-майор Михаил
                                        Носулев. В своём выступлении генерал-майор напомнил всем о стойкости, героизме,
                                        воинской доблести и готовности к самопожертвованию воинов Великой Отечественной
                                        войны и тружеников тыла.
                                    </Text>
                                </ScrollView>
                            </Fragment>
                        )}
                    </View>
                </View>
                {/* Водитель */}
                <View style={styles.instructionBase}>
                    <View style={styles.instructionView}>
                        <TouchableOpacity style={styles.instructionViewTitle} onPress={this.pressDriver}>
                            <Text style={styles.instructionTitle} onPress={this.pressDriver}>
                                Водитель
                            </Text>
                            {driverView ? (
                                <Icon name='ios-arrow-up' size={42} color={'#d3d3d3'} onPress={this.pressDriver} />
                            ) : (
                                <Icon name='ios-arrow-down' size={42} color={'#d3d3d3'} onPress={this.pressDriver} />
                            )}
                        </TouchableOpacity>
                        {driverView && (
                            <Fragment>
                                <ScrollView>
                                    <Text style={styles.instructionText}>
                                        Глава Бурятии Алексей Цыденов, поздравляя жителей, назвал День Победы священным
                                        праздником для всей страны. «9 мая - символ героизма и единства нашего народа,
                                        несгибаемой стойкости и воли, веры в правое дело. Мы помним о каждом, кто отдал
                                        свою жизнь за Победу», - сказал Цыденов. Далее торжественным маршем по главной
                                        площади столицы Бурятии прошли военнослужащие различных родов войск, а также
                                        представители МЧС, сотрудники правоохранительных служб, юнармейцы и др. Всего в
                                        параде приняли участие 1600 человек, из них 1200 – военные Глава Бурятии Алексей
                                        Цыденов, поздравляя жителей, назвал День Победы священным праздником для всей
                                        страны. «9 мая - символ героизма и единства нашего народа, несгибаемой стойкости
                                        и воли, веры в правое дело. Мы помним о каждом, кто отдал свою жизнь за Победу»,
                                        - сказал Цыденов. Далее торжественным маршем по главной площади столицы Бурятии
                                        прошли военнослужащие различных родов войск, а также представители МЧС,
                                        сотрудники правоохранительных служб, юнармейцы и др. Всего в параде приняли
                                        участие 1600 человек, из них 1200 – военные Глава Бурятии Алексей Цыденов,
                                        поздравляя жителей, назвал День Победы священным праздником для всей страны. «9
                                        мая - символ героизма и единства нашего народа, несгибаемой стойкости и воли,
                                        веры в правое дело. Мы помним о каждом, кто отдал свою жизнь за Победу», -
                                        сказал Цыденов. Далее торжественным маршем по главной площади столицы Бурятии
                                        прошли военнослужащие различных родов войск, а также представители МЧС,
                                        сотрудники правоохранительных служб, юнармейцы и др. Всего в параде приняли
                                        участие 1600 человек, из них 1200 – военные Глава Бурятии Алексей Цыденов,
                                        поздравляя жителей, назвал День Победы священным праздником для всей страны. «9
                                        мая - символ героизма и единства нашего народа, несгибаемой стойкости и воли,
                                        веры в правое дело. Мы помним о каждом, кто отдал свою жизнь за Победу», -
                                        сказал Цыденов. Далее торжественным маршем по главной площади столицы Бурятии
                                        прошли военнослужащие различных родов войск, а также представители МЧС,
                                        сотрудники правоохранительных служб, юнармейцы и др. Всего в параде приняли
                                        участие 1600 человек, из них 1200 – военные
                                    </Text>
                                </ScrollView>
                            </Fragment>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default InstructionScreen;

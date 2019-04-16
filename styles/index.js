import { StyleSheet, Dimensions } from 'react-native';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const styles = StyleSheet.create({
    backgroundContainer: {
        flex:1,
        width: null,
        height: null,
    },
    logoContainer: {
        marginLeft: 24,
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: '5%'
    },
    logoText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '500',
    },
    logoIcon: {
        marginTop: 15
    },
    inputBlock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        paddingLeft: 15,
        marginBottom: 15
    },
    inputHalf: {
        flex:1,
        height: 45,
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        paddingLeft: 15,
        marginBottom: 15
    },
    inputWithIcon: {
        height: 45,
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        paddingLeft: 48,
    },
    inputWithIconCountryCode: {
        height: 45,
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        paddingLeft: 71,
    },
    countryCode: {
        position: 'absolute',
        top: 12,
        paddingLeft: 48,
        fontSize: 16,
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 15
    },
    buttonIcon: {

    },
    inputContainer: {
        width: WIDTH - 55,
        marginHorizontal: 25,
        marginTop: 10,
//        flex: 1
    },
    btnEye: {
        position: 'absolute',
        top: 8,
        right: 37
    },
    button: {
        width: WIDTH / 2,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        marginTop: 10
    },
    buttonBottom: {
        width: WIDTH / 2,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    text: {
        color: '#FFC234',
        fontSize: 16,
        textAlign: 'center'
    },
    blackText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center'
    },

    h2: {
        fontSize: 18
    },
    description: {
        color: 'grey',
        marginHorizontal: 35,
        textAlign: 'center',
        top: 10,
        marginBottom: 10
    },
    //for ScrollView
    registrationScreen: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingTop: 10
    },
    registrationPhoto: {
        width: '100%',
    },
    registrationPhotoContainer: {

    },
    camButton: {
        backgroundColor: '#FFC234',
        marginBottom: 15,
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
    },

    choiceCameraRoll: {
        height: 200,
        backgroundColor: "white",
        shadowColor: "black",
        width: WIDTH * 0.9,
        elevation: 5, 
        borderRadius: 10
    },
    choiceCameraRollItem: {
        backgroundColor: '#FFC234',
        borderRadius:10,
        margin: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    choiceCameraRollCancel: {
        backgroundColor: 'black',
        borderRadius: 10,
        margin: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

})
export default styles;

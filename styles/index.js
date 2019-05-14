import { StyleSheet, Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
	backgroundContainer: {
		flex: 1,
		width: null,
		height: null
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
		fontWeight: '500'
	},

	logoIcon: {
		marginTop: 15
	},

	inputBlock: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	input: {
		height: 45,
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 16,
		paddingLeft: 15,
		marginBottom: 15,
		justifyContent: 'center'
	},

	datePickerText: {
		fontSize: 16,
		color: 'grey'
	},

	inputHalf: {
		flex: 1,
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
		paddingLeft: 48
	},

	inputWithIconCountryCode: {
		height: 45,
		borderWidth: 1,
		borderRadius: 15,
		fontSize: 16,
		paddingLeft: 71
	},

	countryCode: {
		position: 'absolute',
		top: 12,
		paddingLeft: 48,
		fontSize: 16
	},

	inputIcon: {
		position: 'absolute',
		top: 8,
		left: 15
	},

	inputContainer: {
		width: WIDTH - 55,
		marginHorizontal: 25,
		marginTop: 10
		//        flex: 1
	},

	policy: {
		marginHorizontal: 45,
		flexDirection: 'row',
		flex: 1
	},

	btnEye: {
		position: 'absolute',
		top: 8,
		right: 20
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

	mainMenuItemText: {
		color: 'black',
		fontSize: 20
		//   textAlign: 'center'
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

	descriptionTwo: {
		color: 'grey',
		marginHorizontal: 6,
		textAlign: 'left',
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
		width: '100%'
	},

	camButton: {
		backgroundColor: '#FFC234',
		marginBottom: 15,
		width: 45,
		height: 45,
		borderRadius: 25,
		justifyContent: 'center'
	},

	camButton: {
		backgroundColor: '#FFC234',
		marginBottom: 15,
		width: 45,
		height: 45,
		borderRadius: 25,
		justifyContent: 'center'
	},

	choiceCameraRoll: {
		height: 200,
		backgroundColor: 'white',
		shadowColor: 'black',
		width: WIDTH * 0.9,
		elevation: 5,
		borderRadius: 10
	},

	choiceCameraRollItem: {
		backgroundColor: '#FFC234',
		borderRadius: 10,
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

	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: HEIGHT,
		width: WIDTH
	},

	photoButtonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 16
	},

	fullScreenPicture: {
		marginVertical: 10
	},

	registrationQuestion: {
		marginTop: 10,
		fontSize: 16
	},

	drawerUserContainer: {
		flexDirection: 'row',
		height: 120,
		backgroundColor: '#FFC234',
		//   alignContent: "center",
		alignItems: 'center',
		padding: 18,
		paddingTop: 40
	},

	drawerUserName: {
		flex: 2,
		textAlign: 'center',
		fontSize: 24,
		paddingLeft: 6
	},

	drawerTopItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		height: 56,
		borderColor: '#C4C4C4',
		padding: 12
	},

	drawerFontTopItem: {
		fontSize: 16
	},

	drawerLicenseAgreement: {
		alignSelf: 'center',
		color: '#c69523',
		//   paddingTop: 120,
		//   Self: 'flex-end',

		paddingBottom: 16
	},

	instructionBase: {
		marginHorizontal: 15,
		marginTop: 10	
	},

	instructionView: {
		padding: 5,
		borderRadius: 3,
		justifyContent: 'center'
	},

	instructionViewTitle: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 40,
		alignItems: 'center',
	},

	instructionTitle: {
		fontSize: 16
	},

	instructionText: {
		flex: 1,
		justifyContent: 'flex-start',
		padding: 5
    },
    
    orderRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "flex-start",
        height: 40,
        alignItems: 'center',
    },

    orderRowView: {
        display: 'flex',
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    }, 

    orderText: {
		flex: 1,
		justifyContent: 'flex-start',
		padding: 10
    },
    
    orderIcon: {
        paddingRight: 5
    },

    orderIconTime: {
        paddingRight: 5,
        paddingLeft: 3
    },

    orderButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    orderBase: {
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 15,	
    },

    orderDescription: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: "flex-start",
		marginTop: 20	
    },

    textButton: {
        fontWeight: 'bold',
    },

    
    mainTopBackground: {
        flex: 1,
        backgroundColor: '#FFC234',
        padding: 18
    },

    mainFontUserName: {
        fontSize: 32,
        textAlign: 'center',
        paddingBottom: 6
    },

    mainFontUserType: {
        fontSize: 24,
        textAlign: 'center',
        color: '#4D443F',
        fontWeight: '100',
        paddingBottom: 42
        //     padding: 12
    },

    mainFontBalance: {
        fontSize: 24,
        textAlign: 'center',
        paddingBottom: 6
    },

    mainFontTopUpBalance: {
        fontSize: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
        color: '#4D443F',
        paddingBottom: 8
    },

    mainWorkingItem: {
        flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 56,
		padding: 12
    },

    orderDetailButton: {
        marginTop: 20,
        marginHorizontal: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    executorBase: {
        marginHorizontal: 15,
        marginBottom: 5,
    },
    executorDescription: {
        flex: 1,
        justifyContent: "flex-start",
        paddingLeft: 10
    },
    executorText: {
        marginBottom: 10,
        marginTop: 10,
    },
    executorTextDisp: {
        marginBottom: 10,
    },
});
export default styles;

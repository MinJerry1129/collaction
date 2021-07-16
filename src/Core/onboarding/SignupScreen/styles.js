import { StyleSheet, Dimensions, I18nManager } from 'react-native';
import { modedColor } from '../../helpers/colors';
import TNColor from '../../truly-native/TNColor';

const { height } = Dimensions.get('window');
const imageSize = height * 0.232;
const photoIconSize = imageSize * 0.27;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainBtnColor,
      marginTop: 25,
      marginBottom: 30,
      alignSelf: 'stretch',
      textAlign: 'left',
      marginLeft: 35,
    },

    content: {
      paddingLeft: 50,
      paddingRight: 50,
      textAlign: 'center',
      fontSize: appStyles.fontSet.middle,
      color: appStyles.colorSet[colorScheme].mainBtnColor,
    },
    loginContainer: {
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainBtnColor,
      borderRadius: appStyles.sizeSet.radius,
      padding: 10,
      marginTop: 30,
    },
    loginText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    placeholder: {
      color: 'red',
    },
    InputContainer: {
      height: 72,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      backgroundColor: modedColor(
        appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
        TNColor('#e0e0e0'),
      ),
      paddingLeft: 20,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 25,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },

    signupContainer: {
      alignSelf: 'center',
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainBtnColor,
      borderRadius: appStyles.sizeSet.radius,
      padding: 10,
      marginTop: 50,
      height: 72,
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signupText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageBlock: {
      flex: 2,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      height: imageSize,
      width: imageSize,
      borderRadius: imageSize,
      shadowColor: '#006',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      overflow: 'hidden',
    },
    formContainer: {
      width: '100%',
      flex: 4,
      alignItems: 'center',
    },
    photo: {
      marginTop: imageSize * 0.77,
      marginLeft: -imageSize * 0.29,
      width: photoIconSize,
      height: photoIconSize,
      borderRadius: photoIconSize,
    },
    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d9d9d9',
      opacity: 0.8,
      zIndex: 2,
    },
    orTextStyle: {
      color: 'black',
      marginTop: 20,
      marginBottom: 10,
      alignSelf: 'center',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    PhoneNumberContainer: {
      marginTop: 10,
      marginBottom: 10,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    smsText: {
      color: '#4267b2',
    },
    tos: {
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center',
      height: 30,
      flexDirection: 'row'
    },
    textLinkStyle: {
      color:  appStyles.colorSet[colorScheme].primaryTextColor,
      fontSize: 15,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
};

export default dynamicStyles;

import { StyleSheet, Dimensions } from 'react-native';
import { I18nManager } from 'react-native';
import { modedColor } from '../../helpers/colors';
import TNColor from '../../truly-native/TNColor';

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
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 25,
      marginBottom: 50,
      alignSelf: 'stretch',
      textAlign: 'left',
      marginLeft: 35,
    },
    sendContainer: {
      width: '80%',
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainBtnColor,
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
    },
    sendText: {
      color: '#ffffff',
    },
    InputContainer: {
      height: 72,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      backgroundColor: modedColor(
        appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
        TNColor('#e0e0e0'),
      ),
      paddingLeft: 10,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 25,
    },

    flagStyle: {
      width: 35,
      height: 25,
      borderColor: appStyles.colorSet[colorScheme].mainTextColor,
      borderBottomLeftRadius: 25,
      borderTopLeftRadius: 25,
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    phoneInputTextStyle: {
      borderLeftWidth: I18nManager.isRTL ? 0 : 1,
      borderRightWidth: I18nManager.isRTL ? 1 : 0,
      borderLeftWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      height: 42,
      fontSize: 15,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      borderBottomRightRadius: I18nManager.isRTL ? 0 : 25,
      borderTopRightRadius: 25,
      borderTopRightRadius: I18nManager.isRTL ? 0 : 25,
      borderBottomLeftRadius: I18nManager.isRTL ? 25 : 0,
      borderTopLeftRadius: I18nManager.isRTL ? 25 : 0,
      paddingLeft: 10,
    },
    input: {
      flex: 1,
      borderLeftWidth: 1,
      borderRadius: 3,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      fontWeight: '700',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    codeFieldContainer: {
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      width: '80%',
      height: 42,
      marginTop: 30,
      alignSelf: 'center',
      borderRadius: 25,
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    orTextStyle: {
      marginTop: 40,
      marginBottom: 10,
      alignSelf: 'center',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    facebookContainer: {
      width: '80%',
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4267b2',
      borderRadius: 25,
      marginTop: 30,
      alignSelf: 'center',
      padding: 10,
    },
    appleButtonContainer: {
      width: '70%',
      marginTop: 16,
      alignSelf: 'center',
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
    },
    facebookText: {
      color: '#ffffff',
      fontSize: 14,
    },
    signWithEmailContainer: {
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center'
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

import { I18nManager } from 'react-native';
import { StyleSheet } from 'react-native';
import { modedColor } from '../../helpers/colors';
import TNColor from '../../truly-native/TNColor';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    orTextStyle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      marginTop: 40,
      marginBottom: 10,
      alignSelf: 'center',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainBtnColor,
      marginTop: 25,
      marginBottom: 20,
      alignSelf: 'stretch',
      textAlign: 'left',
      marginLeft: 30,
    },
    loginContainer: {
      width: '80%',
      backgroundColor: appStyles.colorSet[colorScheme].mainBtnColor,
      borderRadius: 25,
      height: 72,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      alignSelf: 'center',
    },
    loginText: {
      color: '#ffffff',
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

    facebookContainer: {
      width: '80%',
      backgroundColor: '#4267B2',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
      padding: 10,
      height: 72,
      marginTop: 30,
      alignSelf: 'center',
    },
    appleButtonContainer: {
      width: '80%',
      height: 72,
      borderRadius: 25,     
      padding: 10,
      marginTop: 16,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    facebookText: {
      color: '#ffffff',
      fontSize: 14,
    },
    phoneNumberContainer: {
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    forgotPasswordContainer: {
      width: '80%',
      alignSelf: 'center',
      alignItems: 'flex-end',
    },
    forgotPasswordText: {
      color:  appStyles.colorSet[colorScheme].secondaryTextColor,
      fontSize: 14,
      padding: 4,
    },
    textLinkStyle: {
      color:  appStyles.colorSet[colorScheme].primaryTextColor,
      fontSize: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });
};

export default dynamicStyles;

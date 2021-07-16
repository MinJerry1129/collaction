import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    logo: {
      width: 236,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: -100,
    },
    logoImage: {
      width: '90%',
      marginTop: '4%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: appStyles.colorSet[colorScheme].secondaryTextColor,
    },
    welcome: {
      width: 312,
      height: 312,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    welcomeImage: {
      width: '80%',
      height: '80%',
      marginBottom: '40%',
      resizeMode: 'contain',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
    caption: {
      fontSize: 15,
      paddingHorizontal: 50,
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'center',
      color: '#999FAE',
      fontWeight: 'bold',
    },
    loginContainer: {
      width: '70%',
      backgroundColor: '#7C37A6',
      borderRadius: 20,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
      justifyContent: 'center',
      height: 72,
    },
    loginText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      fontWeight: 'bold',
    },
    signupContainer: {
      justifyContent: 'center',
      width: '70%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderRadius: 20,
      borderWidth: Platform.OS === 'ios' ? 0.5 : 1.0,
      borderColor: '#292930',
      padding: 10,
      marginTop: 20,
      alignSelf: 'center',
      height: 72,
    },
    signupText: {
      color: '#292930',
    },
  });
};

export default dynamicStyles;

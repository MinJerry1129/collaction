import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: '5%',
      color: '#7C37A6',
    },
    text: {
      fontSize: 15,
      paddingBottom: '15%',
      textAlign: 'center',
      color: '#27272E',
      paddingLeft: 10,
      paddingRight: 10,
    },
    image: {
      width: '60%',
      height:'60%',
      marginBottom: '10%',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    button: {
      fontSize: 24,
      color: '#7C37A6',
      fontWeight: 'bold',
      marginTop: 15,
    },
  });
};

export default dynamicStyles;

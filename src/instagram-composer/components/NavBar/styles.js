import { Dimensions, StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import composerStyle from '../../styles';

const { width } = Dimensions.get('window');

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      flexDirection: 'row',
      width,
      ...ifIphoneX(
        {
          height: 80,
        },
        {
          height: 55,
        },
      ),
      borderBottomColor:
        composerStyle.navThemeConstants[colorScheme].hairlineColor,
      borderBottomWidth: 1,
      backgroundColor:
        composerStyle.navThemeConstants[colorScheme].backgroundColor,
    },
    textContainer: {
      justifyContent: 'flex-end',
      marginBottom: 7,
      alignItems: 'center',
    },
    text: {
      color: composerStyle.navThemeConstants[colorScheme].fontColor,
      fontSize: 16,
    },
    nextText: {
      paddingLeft: 15,
      fontWeight: '500',
    },
    leftContainer: {
      flex: 2,
    },
    titleContainer: {
      flex: 6,
    },
    rightContainer: {
      flex: 2,
    },
  });
};

export default dynamicStyles;

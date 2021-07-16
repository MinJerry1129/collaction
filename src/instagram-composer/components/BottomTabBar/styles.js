import { Dimensions, StyleSheet } from 'react-native';
import composerStyle from '../../styles';

const { width } = Dimensions.get('window');

const styles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width,
      height: 60,
      flexDirection: 'row',
      backgroundColor:
        composerStyle.navThemeConstants[colorScheme].backgroundColor,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 17,
      color: composerStyle.navThemeConstants[colorScheme].secondaryFontColor,
      // color: '#0d0d0d',
    },
    titleFocused: {
      color:
        composerStyle.navThemeConstants[colorScheme].secondaryFontColorFocused,
    },
  });
};

export default styles;

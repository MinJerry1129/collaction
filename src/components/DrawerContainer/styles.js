import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    container: {
      flex: 1,
      alignItems: 'flex-start',
      paddingHorizontal: 20,
    },
  });
};

export default dynamicStyles;

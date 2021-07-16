import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    btnClickContain: {
      flexDirection: 'row',
      padding: 5,
      marginTop: 5,
      marginBottom: 5,
    },
    btnContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    btnIcon: {
      tintColor: AppStyles.colorSet[colorScheme].mainBtnColor,
      height: 25,
      width: 25,
    },
    btnText: {
      fontSize: 15,
      marginLeft: 18,
      marginTop: 2,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
    },
  });
};

export default dynamicStyles;

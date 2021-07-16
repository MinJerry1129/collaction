import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import AppStyles from '../../AppStyles';

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    tabBarContainer: {
      ...ifIphoneX(
        {
          height: 80,
        },
        {
          height: 45,
        },
      ),
      backgroundColor: AppStyles.colorSet[colorScheme].tabColor,
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: AppStyles.colorSet[colorScheme].hairlineColor,
    },
    tabContainer: {
      backgroundColor: AppStyles.colorSet[colorScheme].tabColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabIcon: {
      ...ifIphoneX(
        {
          width: 25,
          height: 25,
        },
        {
          width: 22,
          height: 22,
        },
      ),
    },
    focusTintColor: {
      tintColor: AppStyles.colorSet[colorScheme].mainBtnColor,
    },
    unFocusTintColor: {
      tintColor: AppStyles.colorSet[colorScheme].bottomTintColor,
    },
  });
};

export default dynamicStyles;

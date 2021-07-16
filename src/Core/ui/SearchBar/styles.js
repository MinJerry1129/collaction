import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      marginBottom: 4,
      flexDirection: 'row',
      height: 60,
    },
    cancelButtonText: {
      color: appStyles.colorSet[colorScheme].mainBtnColor,
      fontSize: 16,
      marginBottom: 5,
    },
    searchInput: {
      fontSize: 14,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
    },
  });
};

export default dynamicStyles;

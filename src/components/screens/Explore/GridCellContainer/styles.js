import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      width: deviceWidth * 0.97,
      marginBottom: 1,
      alignItems: 'center',
    },
    fieldLayoutContainer: {
      height: '100%',
      width: '100%',
    },
    image: {
      height: '100%',
      width: '100%',
    },
    columnCells: {
      height: deviceHeight * 0.332,
      width: '100%',
      flexDirection: 'row',
      marginTop: 1,
    },
    largeCell: {
      flex: 3.8,
      marginRight: 1,
    },
    smallCellColumnContainer: {
      flex: 1.9,
      justifyContent: 'space-between',
    },
    mediaContainer: {
      height: deviceHeight * 0.18,
      flex: 1,
      marginRight: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mediaFieldLayoutContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    media: {
      height: '100%',
      width: '100%',
    },
  });
};
export default dynamicStyles;

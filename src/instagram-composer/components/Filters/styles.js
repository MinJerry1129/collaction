import { Dimensions, StyleSheet } from 'react-native';
import composerStyle from '../../styles';

const { width } = Dimensions.get('window');
const filterItemSize = Math.floor(width / 3.8);

const styles = (colorScheme) => {
  return new StyleSheet.create({
    filtersContainer: {
      flex: 1,
    },
    filterItemsContainer: {
      alignItems: 'center',
      paddingBottom: filterItemSize,
      paddingLeft: 20,
    },
    filterItemContainer: {
      height: filterItemSize,
      width: filterItemSize + 15,
      margin: 3,
    },
    filterItemTitle: {
      fontSize: 14,
      fontWeight: '300',
      color: composerStyle.colorSet[colorScheme].grey,
      paddingVertical: 8,
      textAlign: 'center',
    },
    filterItemImageContainer: {
      width: '100%',
      height: '100%',
    },
    filterItemImage: {
      width: '100%',
      height: '100%',
    },
  });
};

export default styles;

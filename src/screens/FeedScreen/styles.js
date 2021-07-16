import { StyleSheet } from 'react-native';

const navIconSize = 25;

const styles = new StyleSheet.create({
  container: {
    flex: 1,
  },
  doubleNavIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    width: navIconSize,
    height: navIconSize,
    margin: 6,
  },
  navIconMenuOptions: {
    flexDirection: 'row',
    width: null,
  },
});

export default styles;

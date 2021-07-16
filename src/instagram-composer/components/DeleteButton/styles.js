import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cancelContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 70,
    alignSelf: 'center',
  },
  cancelTitle: {
    fontSize: 16,
    color: '#ff4d4d',
    paddingLeft: 4,
    fontWeight: '500',
  },
  cancelIcon: {
    width: 14,
    height: 14,
  },
});

export default styles;

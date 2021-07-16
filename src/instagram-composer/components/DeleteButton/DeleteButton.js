import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import styles from './styles';

export default function DeleteButton(props) {
  const { onPress, title } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.cancelContainer}>
      <Image
        style={styles.cancelIcon}
        source={require('../../assets/icons/left-arrow.png')}
      />
      <Text style={styles.cancelTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

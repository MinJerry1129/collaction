import React from 'react';
import { Text, Linking, View, Image } from 'react-native';
import { IMLocalized } from '../../localization/IMLocalization';

const TermsOfUseView = (props) => {
  const { tosLink, style } = props;
  return (
    <View style={style}>
      <Image source={require('../../../../assets/icons/shield.png')} />
      <Text
        style={{ color: '#999FAE', fontSize: 15 }}
        onPress={() => Linking.openURL(tosLink)}>
        {IMLocalized('Terms of Service and Privacy Policy')}
      </Text>
    </View>
  );
};

export default TermsOfUseView;

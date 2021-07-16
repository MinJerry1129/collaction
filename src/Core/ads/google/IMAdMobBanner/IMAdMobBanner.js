import React from 'react';
import { AdMobBanner } from 'react-native-admob';
import { View } from 'react-native';
import styles from './styles';
export default function IMAdMobBanner({
  appConfig,
  onAdLoaded,
  onAdFailedToLoad,
}) {
  return (
    <View style={styles.adContainer}>
      <AdMobBanner
        adSize={appConfig.adMobConfig.adBannerSize}
        adUnitID={appConfig.adMobConfig.adUnitID}
        testDevices={[AdMobBanner.simulatorId]}
        onAdFailedToLoad={onAdFailedToLoad}
        onAdLoaded={onAdLoaded}
      />
    </View>
  );
}

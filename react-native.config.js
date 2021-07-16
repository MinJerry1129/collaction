module.exports = {
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-image-filter-kit': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    '@react-native-community/cameraroll': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    'react-native-twilio-video-webrtc': {
      platforms: {
        android: null, // enable/disable react-native-twilio-video-webrtc on Android platform.
      },
    },
    'react-native-webrtc': {
      // platforms: {
      //   android: null, // enable/disable react-native-webrtc on Android platform.
      // },
    },
  },
};

// Please note that for Android platform, you must comment out one of react-native-twilio-video-webrtc or react-native-webrtc to use the other.
// A dependency conflict will occur on Android platform if you do not comment out one of the two.

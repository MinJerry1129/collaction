import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';
import styles from './styles';
import FastImage from 'react-native-fast-image';

const Image = FastImage;

const assets = {
  phoneCall: require('../../assets/phone-call.png'),
  endCall: require('../../assets/end-call.png'),
  microphone: require('../../assets/microphone.png'),
  speaker: require('../../assets/speaker.png'),
};

const VideoChatView = (props) => {
  const {
    isComInitiated,
    isMuted,
    isSpeaker,
    toggleSpeaker,
    toggleMute,
    endCall,
    onAcceptCall,
    videoTracks,
  } = props;

  const [largeFillingRtcContainer, setLargeFillingRtcContainer] = useState(
    styles.largeFillingRtcContainer,
  );
  const [
    singleSmallLocalRtcContainer,
    setSingleSmallLocalRtcContainer,
  ] = useState([styles.singleSmallLocalRtcContainer]);
  const [isLocalLargeContainer, setIsLocalLargeContainer] = useState(false);
  const isNotGroupStream = videoTracks;

  const switchStreams = () => {
    const oldLargeFillingRtcContainer = largeFillingRtcContainer;
    const oldSingleSmallLocalRtcContainer = singleSmallLocalRtcContainer;

    if (isNotGroupStream) {
      setLargeFillingRtcContainer(oldSingleSmallLocalRtcContainer);
      setSingleSmallLocalRtcContainer(oldLargeFillingRtcContainer);
      setIsLocalLargeContainer(
        (isLocalLargeContainer) => !isLocalLargeContainer,
      );
    }
  };

  const renderRemoteStreams = ([trackSid, trackIdentifier]) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (isLocalLargeContainer) {
            switchStreams();
          }
        }}
        key={trackSid}
        style={
          isNotGroupStream
            ? largeFillingRtcContainer
            : styles.groupSmallLocalRtcContainer
        }>
        <TwilioVideoParticipantView
          style={styles.rtcStream}
          key={trackSid}
          trackIdentifier={trackIdentifier}
        />
      </TouchableOpacity>
    );
  };

  const renderStreamOne = (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (!isLocalLargeContainer) {
          switchStreams();
        }
      }}
      style={
        isNotGroupStream
          ? singleSmallLocalRtcContainer
          : [largeFillingRtcContainer]
      }>
      <TwilioVideoLocalView enabled={true} style={styles.rtcStream} />
    </TouchableOpacity>
  );

  const renderStreamTwo = videoTracks && (
    <View
      style={
        isNotGroupStream
          ? {
              position: 'relative',
              width: '100%',
              height: '100%',
            }
          : styles.remoteStreamsContainer
      }>
      {Array.from(videoTracks, renderRemoteStreams)}
    </View>
  );

  const renderStreams = () => {
    if (isLocalLargeContainer) {
      return (
        <>
          {renderStreamOne}
          {renderStreamTwo}
        </>
      );
    } else {
      return (
        <>
          {renderStreamTwo}
          {renderStreamOne}
        </>
      );
    }
  };

  return (
    <>
      {renderStreams()}
      <View style={styles.control}>
        <TouchableOpacity
          onPress={toggleSpeaker}
          style={[
            styles.controlIconContainer,
            isSpeaker && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={assets.speaker}
            style={[styles.imageIcon, isSpeaker && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleMute}
          style={[
            styles.controlIconContainer,
            isMuted && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={assets.microphone}
            style={[styles.imageIcon, isMuted && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlIconContainer, { backgroundColor: '#fc2e50' }]}
          onPress={endCall}>
          <Image source={assets.endCall} style={styles.imageIcon} />
        </TouchableOpacity>
        {!isComInitiated && (
          <TouchableOpacity
            style={[
              styles.controlIconContainer,
              { backgroundColor: '#6abd6e' },
            ]}
            onPress={onAcceptCall}>
            <Image source={assets.phoneCall} style={styles.imageIcon} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default VideoChatView;

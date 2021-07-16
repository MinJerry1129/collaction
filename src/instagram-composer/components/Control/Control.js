import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';

export default function Control(props) {
  const {
    onShutterPress,
    didLongPress,
    didStopLongPress,
    allowLongPress,
  } = props;
  const [minutesCounter, setMinutesCounter] = useState('00');
  const [secondsCounter, setSecondsCounter] = useState('00');
  const [helpInfo, setHelpInfo] = useState(null);
  const minutesCounterRef = useRef('00');
  const secondsCounterRef = useRef('00');
  const timer = useRef(null);
  const longPressActive = useRef(false);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const onTimerStart = () => {
    timer.current = setInterval(() => {
      let num = (Number(secondsCounterRef.current) + 1).toString(),
        count = minutesCounterRef.current;

      if (Number(secondsCounterRef.current) === 59) {
        count = (Number(minutesCounterRef.current) + 1).toString();
        num = '00';
      }

      minutesCounterRef.current = count.length === 1 ? '0' + count : count;
      secondsCounterRef.current = num.length === 1 ? '0' + num : num;

      setSecondsCounter(secondsCounterRef.current);
      setMinutesCounter(minutesCounterRef.current);
    }, 1000);
  };

  const onTimerStop = () => {
    clearInterval(timer.current);
  };

  const onTimerClear = () => {
    timer.current = null;
    minutesCounterRef.current = '00';
    secondsCounterRef.current = '00';
    setMinutesCounter('00');
    setSecondsCounter('00');
  };

  const startTimer = () => {
    if (allowLongPress) {
      setHelpInfo(null);
      longPressActive.current = true;
      onTimerStart();
      didLongPress();
    }
  };

  const stopTimer = () => {
    if (allowLongPress && longPressActive.current) {
      longPressActive.current = false;
      onTimerStop();
      onTimerClear();
      didStopLongPress();
    }
  };

  const onPress = () => {
    if (!allowLongPress) {
      onShutterPress();
    } else {
      setHelpInfo('Press and hold to record.');
      setTimeout(() => {
        setHelpInfo(null);
      }, 5000);
    }
  };

  return (
    <View style={styles.container}>
      {longPressActive.current && (
        <View style={styles.timerContainer}>
          <View style={styles.indicator} />
          <Text style={styles.timer}>
            {minutesCounter} : {secondsCounter}
          </Text>
        </View>
      )}
      {helpInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{helpInfo}</Text>
        </View>
      )}
      <View style={styles.controlContainer}>
        <View style={styles.shutterCircleContainer}>
          <TouchableOpacity
            onLongPress={startTimer}
            onPressOut={stopTimer}
            onPress={onPress}
            activeOpacity={0.6}
            style={styles.shutterContainer}
          />
        </View>
      </View>
    </View>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Separator } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '../contants';
import { Display } from '../utils';
import axios from 'axios';

const VerificationScreen = ({
  route: {
    params: { phoneNumber },
  },
  navigation,
}) => {
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const fifthInput = useRef();
  const sixthInput = useRef();
  const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
  const [secret, setSecret] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await AsyncStorage.getItem('token');
      console.log('fetched token', fetchedToken);
      setToken(fetchedToken);
      if (fetchedToken) {
        sendOTP();
      }
    };

    fetchToken();
  }, []);

  const sendOTP = async () => {
    try {
      console.log("send token", token);
      const response = await axios.post('http://10.74.0.145:3000/api/sendOTP', { phoneNumber }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setSecret(response.data.secret);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOTP = async () => {
    console.log("verifToken", token);
    const otpToken = otp[1] + otp[2] + otp[3] + otp[4] + otp[5] + otp[6];
    try {
      const response = await axios.post('http://10.74.0.145:3000/api/verifyOTP', {
        phoneNumber,
        token: otpToken,
        secret,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.data.verified) {
        Alert.alert('Success', 'OTP verification successful');
      } else {
        Alert.alert('Failure', 'OTP verification failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.DEFAULT_WHITE}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>OTP Verification</Text>
      </View>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.content}>
        Enter the OTP number just sent you at{' '}
        <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
      </Text>
      <View style={styles.otpContainer}>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={firstInput}
            onChangeText={text => {
              setOtp({ ...otp, 1: text });
              text && secondInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={secondInput}
            onChangeText={text => {
              setOtp({ ...otp, 2: text });
              text ? thirdInput.current.focus() : firstInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={thirdInput}
            onChangeText={text => {
              setOtp({ ...otp, 3: text });
              text ? fourthInput.current.focus() : secondInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={fourthInput}
            onChangeText={text => {
              setOtp({ ...otp, 4: text });
              text ? fifthInput.current.focus() : thirdInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={fifthInput}
            onChangeText={text => {
              setOtp({ ...otp, 5: text });
              text ? sixthInput.current.focus() : fourthInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={sixthInput}
            onChangeText={text => {
              setOtp({ ...otp, 6: text });
              !text && fifthInput.current.focus();
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.signinButton}
        onPress={verifyOTP}>
        <Text style={styles.signinButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 30,
    marginLeft: Display.setWidth(5),
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 35,
    marginTop: Display.setHeight(4),
    marginHorizontal: Display.setWidth(6),
  },
  content: {
    fontSize: 14,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 22,
    marginTop: Display.setHeight(1),
    marginHorizontal: Display.setWidth(6),
  },
  phoneNumberText: {
    fontSize: 14,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 22,
    color: Colors.PRIMARY_BLUE,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Display.setHeight(4),
    paddingHorizontal: Display.setWidth(6),
  },
  otpBox: {
    width: Display.setWidth(12),
    height: Display.setWidth(12),
    borderRadius: Display.setWidth(2),
    borderColor: Colors.GRAY,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 22,
    color: Colors.PRIMARY_BLUE,
  },
  signinButton: {
    marginTop: Display.setHeight(6),
    marginHorizontal: Display.setWidth(6),
    height: Display.setHeight(6),
    backgroundColor: Colors.PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Display.setHeight(1),
  },
  signinButtonText: {
    fontSize: 16,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 22,
    color: Colors.DEFAULT_WHITE,
  },
});

export default VerificationScreen;

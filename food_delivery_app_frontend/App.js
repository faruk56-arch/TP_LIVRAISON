import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Navigators from './src/navigators';
import { Store } from './src/Store';
import { Provider } from 'react-redux';


export default function App() {
  return (
    <Provider store={Store}>
      <Navigators />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


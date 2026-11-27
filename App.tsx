
import 'react-native-gesture-handler';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import './src/sheets/sheet'
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Navigation from './src/navigation/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from './src/constants/Colors';

GoogleSignin.configure({
  webClientId:
    '110660272190-mn3h1e20mubm803cbto1keqs0vbkpcm7.apps.googleusercontent.com',
  forceCodeForRefreshToken: true,
  offlineAccess: false,
  iosClientId:
    '110660272190-og78voivslgfvg1ohj4f86po3j9j3hd9.apps.googleusercontent.com',
});
const App = () => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
    <LinearGradient
      pointerEvents="none"
      colors={[Colors.background, Colors.white]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={StyleSheet.absoluteFill}
    />
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
      translucent={Platform.OS  ===  'ios'}
      backgroundColor="transparent"
      barStyle="dark-content"
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <Navigation/>
        </PersistGate>
     </Provider> 
       </GestureHandlerRootView>
    </View>


  );

};

export default App;


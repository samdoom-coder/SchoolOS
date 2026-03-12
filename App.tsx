import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  BackHandler
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {

  const webviewRef = useRef(null);

  useEffect(() => {

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA
      ]);
    }

    const backAction = () => {
      if (webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();

  }, []);

  const injectedJS = `
  (function() {
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
      const reader = new FileReader();
      reader.onloadend = function() {
        window.ReactNativeWebView.postMessage(reader.result);
      };
      reader.readAsDataURL(blob);
      return originalCreateObjectURL(blob);
    };
  })();
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://seedyaios.vercel.app/' }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={injectedJS}
        originWhitelist={['*']}
        startInLoadingState
        onPermissionRequest={(event:any)=>{
          event.nativeEvent.grant(event.nativeEvent.resources)
        }}
      />
    </SafeAreaView>
  );
};

export default App;
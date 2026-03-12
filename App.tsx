import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  BackHandler
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {

  const webviewRef = useRef<any>(null);

  useEffect(() => {

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
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

    const downloadCSV = (data, filename) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const originalFetch = window.fetch;
    window.fetch = function() {
      return originalFetch.apply(this, arguments).then(async response => {

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("text/csv")) {
          const data = await response.clone().text();
          downloadCSV(data, "export.csv");
        }

        return response;
      });
    };

  })();
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.seedyai.com/' }}
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
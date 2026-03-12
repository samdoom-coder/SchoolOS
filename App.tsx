import React, { useEffect } from 'react';
import { SafeAreaView, PermissionsAndroid, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://chatly.app/' }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        originWhitelist={['*']}
        setSupportMultipleWindows={false}

        onFileDownload={({ nativeEvent }) => {
          Linking.openURL(nativeEvent.downloadUrl);
        }}

        onPermissionRequest={(event: any) => {
          event.nativeEvent.grant(event.nativeEvent.resources);
        }}
      />
    </SafeAreaView>
  );
};

export default App;
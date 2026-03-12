import React, { useEffect } from 'react';
import {
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Linking
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA
      ]);
    }
  }, []);

  const handleNavigation = (request: any) => {
    const url = request.url.toLowerCase();

    const downloadTypes = [
      '.pdf','.csv','.xls','.xlsx','.doc','.docx',
      '.zip','.rar','.jpg','.jpeg','.png','.gif'
    ];

    if (downloadTypes.some(ext => url.includes(ext))) {
      Linking.openURL(url);
      return false;
    }

    if (url.includes('print')) {
      Linking.openURL(url);
      return false;
    }

    return true;
  };

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
        onShouldStartLoadWithRequest={handleNavigation}
        onPermissionRequest={(event: any) => {
          event.nativeEvent.grant(event.nativeEvent.resources);
        }}
      />
    </SafeAreaView>
  );
};

export default App;
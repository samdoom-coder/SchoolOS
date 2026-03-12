import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Linking,
  BackHandler
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {

  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
      }
    };

    requestPermissions();

    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();

  }, [canGoBack]);

  const handleNavigation = (request: any) => {
    const url = request.url.toLowerCase();

    const downloadExtensions = [
      '.pdf','.csv','.xls','.xlsx','.doc','.docx',
      '.zip','.rar','.png','.jpg','.jpeg'
    ];

    if (downloadExtensions.some(ext => url.includes(ext))) {
      Linking.openURL(url);
      return false;
    }

    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://chatly.app/' }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        originWhitelist={['*']}
        setSupportMultipleWindows={false}

        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}

        onShouldStartLoadWithRequest={handleNavigation}

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
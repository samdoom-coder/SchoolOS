import React, { useEffect } from 'react';
import {
  SafeAreaView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import ReactNativeBlobUtil from 'react-native-blob-util';

const App = () => {

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
    }
  }, []);

  const handleDownload = (event: any) => {
    const { url } = event.nativeEvent;

    const { config, fs } = ReactNativeBlobUtil;
    const DownloadDir = fs.dirs.DownloadDir;

    config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: DownloadDir + '/downloaded_file',
        description: 'Downloading file',
      },
    }).fetch('GET', url);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://seedyaios.vercel.app/' }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        originWhitelist={['*']}
        onPermissionRequest={(event: any) => {
          event.nativeEvent.grant(event.nativeEvent.resources);
        }}
        onFileDownload={handleDownload}
      />
    </SafeAreaView>
  );
};

export default App;
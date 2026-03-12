import React, { useEffect } from 'react';
import {
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Linking
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

  const downloadFile = (url: string) => {
    const { config, fs } = ReactNativeBlobUtil;

    const DownloadDir = fs.dirs.DownloadDir;
    const path = DownloadDir + '/file_' + Date.now();

    config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Downloading file',
      },
    }).fetch('GET', url);
  };

  const handleNavigation = (request: any) => {
    const url = request.url;

    const downloadableExtensions = [
      '.pdf',
      '.csv',
      '.xls',
      '.xlsx',
      '.doc',
      '.docx',
      '.ppt',
      '.pptx',
      '.txt',
      '.zip',
      '.rar',
      '.7z',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.mp4',
      '.mp3',
      '.apk'
    ];

    if (downloadableExtensions.some(ext => url.toLowerCase().includes(ext))) {
      downloadFile(url);
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
        onShouldStartLoadWithRequest={handleNavigation}
      />
    </SafeAreaView>
  );
};

export default App;
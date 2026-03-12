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
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ]);
      }
    };

    requestPermissions();
  }, []);

  const downloadFile = (url: string) => {
    const { config, fs } = ReactNativeBlobUtil;

    const DownloadDir = fs.dirs.DownloadDir;
    const filePath = DownloadDir + '/download_' + Date.now();

    config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'Downloading file',
      },
    }).fetch('GET', url);
  };

  const handleNavigation = (request: any) => {
    const url = request.url.toLowerCase();

    const downloadTypes = [
      '.pdf','.csv','.xls','.xlsx','.doc','.docx',
      '.ppt','.pptx','.zip','.rar','.7z',
      '.jpg','.jpeg','.png','.gif',
      '.mp4','.mp3','.apk'
    ];

    if (downloadTypes.some(ext => url.endsWith(ext))) {
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
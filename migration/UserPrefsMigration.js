import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const migrate = async (state) => {
  try {
    if (Platform.OS === 'ios') {
      const documentsDirectoryV1 = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}/RCTAsyncLocalStorage_V1`
      );
      const documentsDirectoryPath = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}`);
      const documentsDirectoryInfo = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}/RCTAsyncLocalStorage`
      );
      console.log('documentsDirectoryPathV1', documentsDirectoryV1);
      console.log('documentsDirectoryPath', documentsDirectoryPath);
      console.log('documentsDirectoryInfo', documentsDirectoryInfo);

      if (documentsDirectoryPath.length !== 0 && documentsDirectoryPath.includes('RCTAsyncLocalStorage')) {
        const manifest = await FileSystem.readAsStringAsync(
          `${FileSystem.documentDirectory}/RCTAsyncLocalStorage/manifest.json`
        );

        const entries = Object.entries(JSON.parse(manifest));
        for (const [key, value] of entries) {
          try {
            await AsyncStorage.setItem(key, value);
            console.log(`Setting ${key} to ${value} passed successfully`);
          } catch (error) {
            console.error(' === MIGRATION FAILED', error);
            return;
          }
        }
        await FileSystem.moveAsync({
          from: `${FileSystem.documentDirectory}/RCTAsyncLocalStorage`,
          to: `${FileSystem.documentDirectory}/RCTAsyncLocalStorage_V1`,
        });
        console.log('=== MIGRATION SUCCESS');
      }
    }
  } catch (error) {
    console.error(error);
    console.error(' === MIGRATION FAILED', error);
  }
};

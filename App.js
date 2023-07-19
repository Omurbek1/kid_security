import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import MyApp from './MyApp';
import { store } from './Store';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import 'react-native-url-polyfill/auto';

LogBox.ignoreLogs([
  'Class GenericShare',
  'Class GooglePlusShare',
  'Class WhatsAppShare',
  'Class InstagramShare',
  'Class EXHomeModule',
  'Class EXTest',
  'Class EXDisabledDevMenu',
  'Class EXDisabledRedBox',
  'componentWillReceiveProps has been renamed',
  'currentlyFocusedField',
  'Calling `getNode()`',
  'Animated: `useNativeDriver`'
]);

console.disableYellowBox = true;

export default function App() {
  return (
    <Provider store={store}>
      <ActionSheetProvider>
        
        <MyApp />
      </ActionSheetProvider>
    </Provider>
  );
}
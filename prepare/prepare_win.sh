# doesn't work on macos due to POSIX sed, so we'll replace the whole file at end of script
# sed -zi 's/@Override//2' node_modules/react-native-installed-packages/android/src/main/java/com/jstokes/RNInstalledAppsPackage.java
sed -i 's/).toInt())/)!!.toInt())/' node_modules/expo-image-picker/android/src/main/java/expo/modules/imagepicker/tasks/VideoResultTask.kt
sed -i 's/_component.measureInWindow/getNode().measureInWindow/' node_modules/react-native-safe-area-view/index.js
sed -i 's/callbacks.onLocationError(/\/\/callbacks.onLocationError(/' node_modules/expo-location/android/src/main/java/expo/modules/location/LocationModule.java
sed -i 's/if (loopCount != 0) {/if (@available(iOS 14, *)) {} else if (loopCount != 0) {/' node_modules/react-native/Libraries/Image/RCTAnimatedImage.m
sed -i 's/if (responseCode != BillingClient.BillingResponseCode.USER_CANCELED)//' node_modules/react-native-iap/android/src/play/java/com/dooboolab/RNIap/RNIapModule.java
sed -i 's/if (transaction.error.code != SKErrorPaymentCancelled)//' node_modules/react-native-iap/ios/RNIapIos.m
cp -fR ./fixes/* ./node_modules

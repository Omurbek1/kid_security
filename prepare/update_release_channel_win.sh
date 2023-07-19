echo "Updating release channel to $1..."
sed -i -E 's/base-[0-9]+/base-'"$1"'/' ./ios/kidsecurity/Supporting/Expo.plist
sed -i -E 's/base-[0-9]+/base-'"$1"'/' ./android/app/src/main/AndroidManifest.xml
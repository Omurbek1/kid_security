echo "Updating app.json version to $1..."
sed -i '' -E 's/"version": "[0-9]+.[0-9]+"/"version": "'"$1"'"/' ./app.json
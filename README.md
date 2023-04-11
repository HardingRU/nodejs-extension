# nodejs-extension
nodejs-extension


# deploy
cd nodejs-example-extension/nodejs-example-extension
chmod +x index.js
cd ..
chmod +x extensions/nodejs-example-extension
zip -r extension.zip .
aws lambda publish-layer-version --layer-name "nodejs-example-extension" --region us-east-1 --zip-file  "fileb://extension.zip"

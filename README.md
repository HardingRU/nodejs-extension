# nodejs-extension
nodejs-extension


# deploy
## Prep Extension Dependencies
Install the extension dependencies locally, which will be mounted along with the extension code.

```bash
$ cd nodejs-example-extension/nodejs-example-extension
$ chmod +x index.js
$ npm install
$ cd ..
```

## Layer Setup Process
The extensions .zip file should contain a root directory called `extensions/`, where the extension executables are located and another root directory called `nodejs-example-extension/`, where the core logic of the extension and its dependencies are located.

Creating zip package for the extension:
```bash
$ chmod +x extensions/nodejs-example-extension
$ zip -r extension.zip .
```

Ensure that you have aws-cli v2 for the commands below.
Publish a new layer using the `extension.zip`. The output of the following command should provide you a layer arn.
```bash
aws lambda publish-layer-version \
 --layer-name "nodejs-example-extension" \
 --region <use your region> \
 --zip-file  "fileb://extension.zip"
```
Note the LayerVersionArn that is produced in the output.
eg. `"LayerVersionArn": "arn:aws:lambda:<region>:123456789012:layer:<layerName>:1"`

Add the newly created layer version to a Node.js 12 runtime Lambda function.

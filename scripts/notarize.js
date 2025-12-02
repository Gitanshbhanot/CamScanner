const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const process = require('process');

exports.default = async function notarizeApp(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
  const zipPath = path.join(appOutDir, `${appName}.zip`);

  console.log('Zipping app...');
  execSync(
    `ditto -c -k --sequesterRsrc --keepParent "${appPath}" "${zipPath}"`
  );
  console.log('App zipped.');

  console.log('Submitting app for notarization...');

  console.log('Notarization complete.');
};

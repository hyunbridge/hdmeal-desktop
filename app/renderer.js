const remote = require('electron').remote;

const isMacAppStoreApp = process.mas
const isMicrosoftStoreApp = process.windowsStore
const isSnapStoreApp = process.platform == 'linux' && process.resourcesPath.includes('snap')
const isUpdateChkEnabled = remote.process.argv.includes('--no-update-check')
document.getElementById('version').innerHTML = `${remote.app.getVersion() + '(' + process.platform + ')'}`
document.getElementById('electronVersion').innerHTML = `${process.versions.electron + '(Chromium  ' + process.versions.chrome + ')'}`
document.getElementById('autoUpdate').innerHTML = `${!(isMacAppStoreApp || isMicrosoftStoreApp || isSnapStoreApp || isUpdateChkEnabled)}`

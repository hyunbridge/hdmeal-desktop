// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")
const path = require('path')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: '흥덕고 급식',
    frame: (process.platform !== 'win32'),  // Windows에서만 프레임 없는 창을 열고, 창 컨트롤 버튼은 직접 구현
    titleBarStyle: 'hidden-inset',  // macOS에서만 타이틀 없는 창 실행
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 400,
    backgroundColor: '#f5f5f5',
    icon: path.join(__dirname, '/assets/icons/png/512x512.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 메뉴바 숨기기
  mainWindow.setMenuBarVisibility(false)

  // and load the index.html of the app.
  mainWindow.loadFile('./app/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
autoUpdater.checkForUpdates()

import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron';
import path from 'node:path';
import electronSquirrelStartup from 'electron-squirrel-startup';

if (electronSquirrelStartup) app.quit();

let mainWindow: BrowserWindow | null;

let bluetoothPinCallback: (response: Electron.Response) => void;
let selectBluetoothCallback: (deviceId: string) => void;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      preload: path.join(__dirname, '../preload/preload.js'),
    },
    icon: path.join(__dirname, './assets/logo.png'),
  });

  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    selectBluetoothCallback = callback
    const result = deviceList.find((device) => {
      return device.deviceName === 'test'
    })
    if (result) {
      callback(result.deviceId)
    } else {
      // The device wasn't found so we need to either wait longer (eg until the
      // device is turned on) or until the user cancels the request
    }
  })

  ipcMain.on('cancel-bluetooth-request', (event) => {
    selectBluetoothCallback('')
  })

  // Listen for a message from the renderer to get the response for the Bluetooth pairing.
  ipcMain.on('bluetooth-pairing-response', (event, response) => {
    bluetoothPinCallback(response)
  })

  mainWindow.webContents.session.setBluetoothPairingHandler((details, callback) => {
    bluetoothPinCallback = callback
    // Send a message to the renderer to prompt the user to confirm the pairing.
    mainWindow?.webContents.send('bluetooth-pairing-request', details)
  })

  // Vite dev server URL
  mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`); //'http://localhost:5173');
  mainWindow.on('closed', (): null => (mainWindow = null));
}

app.whenReady().then((): void => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow();
  }
});
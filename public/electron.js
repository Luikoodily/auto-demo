
const path = require("path");
const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");

let win

const createWindow = () => {
	// Create the browser window.
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js'),
    		contextIsolation: true,
		},
	});

	win.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);

	win.once('ready-to-show', () => {
		win.show()
	});

	// Open the DevTools.
	if (isDev) {
		win.webContents.openDevTools({ mode: "right" });
		require('react-devtools-electron');
	};

	// if (!isDev) {
	// 	autoUpdater.checkForUpdates();
	// };
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

ipcMain.handle('check-for-updates', () => {
	autoUpdater.checkForUpdates();
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Ok'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version is being downloaded.'
	}
	dialog.showMessageBox(dialogOpts, (response) => {

	});

	win.webContents.send('update-available');
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the application to apply the updates.'
	};

	dialog.showMessageBox(dialogOpts).then((returnValue) => {
		if (returnValue.response === 0) autoUpdater.quitAndInstall()
	})

	win.webContents.send('update-downloaded');
});

autoUpdater.on("download-progress", (progress, bytesPerSecond, percent, total, transferred) => {
	// const dialogOpts = {
	// 	type: 'info',
	// 	buttons: ['OK'],
	// 	title: 'INFO',
	// 	message: percent,
	// 	detail: 'fazendo download...'
	// };

	// dialog.showMessageBox(dialogOpts).then((returnValue) => {

	// })

	// win.webContents.send('download-progress');
});


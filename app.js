const electron = require('electron');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu, Tray} = electron;

function createMainWindow() {
	const screen = electron.screen.getPrimaryDisplay().workAreaSize;

	let window = new BrowserWindow({
		width: 612,
		height: 612,
		x: screen.width - 612,
		y: 0,
		autoHideMenuBar: true,
		frame: false,
		show: false,
		resizable: false,
		alwaysOnTop: true,
		skipTaskbar: true,
		icon: path.join(__dirname, 'Icon.png')
	});

	window.loadURL('https://keep.google.com');

	window.on('closed', () => {
		window = null;
	});

	return window;
}

app.on('ready', () => {
	const mainWindow = createMainWindow();

	const tray = new Tray(path.join(__dirname, 'TrayIcon.png'));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Toggle',
			type: 'normal',
			click() {
				mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show(); // eslint-disable-line no-unused-expressions
			}
		}, {
			type: 'separator'
		}, {
			label: 'Quit',
			type: 'normal',
			role: 'quit'
		}
	]);
	tray.setToolTip('Noty - Google Keep app.');
	tray.setContextMenu(contextMenu);

	const {webContents} = mainWindow;

	webContents.on('dom-ready', () => {
		webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css')), 'utf8');
	});

	mainWindow.on('blur', () => {
		mainWindow.hide();
	});
});

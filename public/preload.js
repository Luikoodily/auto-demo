const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('api', {
    checkForUpdates: () => {
        ipcRenderer.invoke('check-for-updates');
    },
    updateAvailable: () => {
        ipcRenderer.on('update-available', () => {
            console.log('Atualização disponível');
        });
    },
    updateDownloaded: () => {
        ipcRenderer.on('update-downloaded', () => {
            console.log('Atualização baixada');
        });
    },
    downloadProgress: () => {
        ipcRenderer.on('update-downloaded', () => {
            console.log('download em andamento');
        });
    },
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});
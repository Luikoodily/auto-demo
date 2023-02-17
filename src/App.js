import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
	const [version, setVersion] = useState('');
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [updateDownloaded, setUpdateDownloaded] = useState(false);

	useEffect(() => {
		window.ipcRenderer.on('update-available', () => {
			setUpdateAvailable(true);
		});

		window.ipcRenderer.on('download-progress', (event, progress) => {
			console.log(progress);
			setDownloadProgress(progress);
		});

		window.ipcRenderer.on('update-downloaded', () => {
			setUpdateDownloaded(true);
		});
	}, []);

	useEffect(() => {
		if (window.versions) {
			console.log({
				node: window.versions.node(),
				chrome: window.versions.chrome(),
				electron: window.versions.electron(),
			})
		}

		fetch('https://api.github.com/repos/mateuscruz22/autoupdater-demo/releases/latest')
			.then(res => res.json())
			.then(json => setVersion(json.tag_name));
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Autoupdater Demo {version}
				</p>
				{updateAvailable && !updateDownloaded && (
					<div>
						<p>Downloading update...</p>
						<progress value={downloadProgress} max="100"></progress>
					</div>
				)}
				{updateDownloaded && (
					<div>
						<p>Update downloaded. Click the button to install and restart the app.</p>
						<button onClick={() => window.ipcRenderer.send('quit-and-install')}>Install update</button>
					</div>
				)}
			</header>
		</div>
	);
}

export default App;

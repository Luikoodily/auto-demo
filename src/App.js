import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
	const [version, setVersion] = useState('');
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);

	useEffect(() => {
		window.ipcRenderer.on('update-available', () => {
			setUpdateAvailable(true);
		});

		window.ipcRenderer.on('download-progress', (event, progress) => {
			setDownloadProgress(progress);
		});

		window.ipcRenderer.on('update-downloaded', () => {
			window.ipcRenderer.send('quit-and-install');
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
				{updateAvailable && (
					<div>
						<p>A new update is available. Downloading...</p>
						<progress value={downloadProgress} max="100"></progress>
					</div>
				)}
			</header>
		</div>
	);
}

export default App;

import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
	const [version, setVersion] = useState('');

	useEffect(() => {

		if (window.versions) {
			console.log({
				node: window.versions.node(),
				chrome: window.versions.chrome(),
				electron: window.versions.electron(),
			})
		}

		if (window.api) {
			window.api.checkForUpdates();
			window.api.updateAvailable();
			window.api.updateDownloaded();		
			window.api.downloadProgress();		
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
			</header>
		</div>
	);
}

export default App;

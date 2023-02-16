import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

function App() {
	const [version, setVersion] = useState('');

	useEffect(() => {
		ipcRenderer.invoke('check-for-updates');

		ipcRenderer.on('update-available', () => {
			console.log('Atualização disponível');
		});

		ipcRenderer.on('update-downloaded', () => {
			console.log('download concluído');
		});

		ipcRenderer.on('download-progress', () => {
			console.log('download em andamento');
		});

		fetch('https://api.github.com/repos/mateuscruz22/autoupdater-demo/releases/latest')
			.then(res => res.json())
			.then(json => { console.log(json); setVersion(json.tag_name) });
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Autoupdater Demo v{version || 'X'}
				</p>
			</header>
		</div>
	);
}

export default App;

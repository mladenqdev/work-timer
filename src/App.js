import './App.css';
import Settings from './components/Settings';
import Timer from './components/Timer';
import {useState} from 'react';
import SettingsContext from './contexts/SettingsContext';

function App() {

	const [showSettings, setShowSettings] = useState(false);
	const [workMinutes, setWorkMinutes] = useState(25)
	const [breakMinutes, setBreakMinutes] = useState(5)

	return (
	<main>
		<SettingsContext.Provider value={{
			showSettings,
			setShowSettings,
			workMinutes,
			breakMinutes,
			setWorkMinutes,
			setBreakMinutes
		}}>
		{showSettings ? <Settings /> : <Timer />}
		</SettingsContext.Provider>
	</main>
	);
}

export default App;

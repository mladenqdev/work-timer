import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import PauseButton from './PauseButton';
import PlayButton from './PlayButton';
import SettingsButton from './SettingsButton';
import { useContext, useState, useEffect, useRef } from 'react';
import SettingsContext from '../contexts/SettingsContext';
import audio from '../assets/sounds/bell.wav';

const red = '#f54e4e';
const green = '#4aec8c';

const Timer = () => {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [pageTitle, setPageTitle] = useState('Ready for work?');
  const [pageFavIcon, setPageFavIcon] = useState('/faviconWork.ico');

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  const playHandle = () => {
	setIsPaused(false);
	isPausedRef.current = false;
	if (pageTitle === 'Break time!') {
		return;
	}
	setPageTitle('Work time!')
  }

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

    useEffect(() => {
	document.title = pageTitle;
	const favicon = document.getElementById("favicon");
	const bell = document.querySelector('.bell-sound');
	favicon.href = pageFavIcon;

    const switchMode = () => {
      const nextMode = modeRef.current === 'work' ? 'break' : 'work';
      const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;
	  console.log(pageFavIcon)

	  if (pageTitle === 'Ready for work' || pageTitle === 'Break time!') {
		setPageTitle('Work time!');
		} else {
		setPageTitle('Break time!')
	  }

	  if (pageFavIcon === '/faviconWork.ico') {
		setPageFavIcon('/favicon.ico')
	  } else {
		setPageFavIcon('/faviconWork.ico')
	  }

	  bell.play();

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    },1000);

    return () => clearInterval(interval);
  }, [settingsInfo, pageTitle, pageFavIcon]);

  const totalSeconds = mode === 'work'
    ? settingsInfo.workMinutes * 60
    : settingsInfo.breakMinutes * 60;
  const percentage = Math.round(secondsLeft / totalSeconds * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if(seconds < 10) seconds = '0'+seconds;

  return (
    <div>
      <CircularProgressbar
        value={percentage}
        text={minutes + ':' + seconds}
        styles={buildStyles({
        textColor:'#fff',
        pathColor:mode === 'work' ? red : green,
        tailColor:'rgba(255,255,255,.2)',
      })} />
      <div style={{marginTop:'20px'}}>
        {isPaused
          ? <PlayButton onClick={playHandle} />
          : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
      </div>
      <div style={{marginTop:'20px'}}>
        <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
      </div>
	  <audio class={'bell-sound'}><source src={audio} type="audio/wav" /></audio>
    </div>
  );
}

export default Timer;
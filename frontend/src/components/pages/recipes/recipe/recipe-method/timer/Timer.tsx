import { useState, useEffect } from 'react';

import clsx from 'clsx';
import './Timer.css';

type TimerProps = {
  time: number;
};

const Timer: React.FC<TimerProps> = ({ time }) => {
  const [timeRemaining, setTimeRemaining] = useState(time * 60 * 1000);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);
  const totalTime = time * 60 * 1000;

  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const mm = Math.floor(totalSeconds / 60);
    const ss = totalSeconds % 60;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  const vibrateDevice = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([500, 200, 500]);
      } catch (error) {
        console.error('Vibration failed:', error);
      }
    } else {
      console.log('Vibration not supported on this device');
      setError(true);
    }
  };

  useEffect(() => {
    let interval: number | null = null;

    if (isCountdownActive && !isPaused) {
      interval = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(interval!);
            // vibrateDevice();
            setIsCountdownActive(false);
            setCompleted(true);
            setError(false);
            return 0;
          }
          setError(false);
          return prevTime - 1000;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCountdownActive, isPaused]);

  const handleStart = () => {
    setIsCountdownActive(true);
    setIsPaused(false);
    setCompleted(false);
    setError(false);
  };

  const handleStop = () => {
    setIsCountdownActive(false);
    setIsPaused(false);
    setCompleted(false);
    setError(false);
    setTimeRemaining(time * 60 * 1000);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <>
      <div className='timer'>
        <progress className='timer-progress' value={totalTime - timeRemaining} max={totalTime}></progress>
        <span className={clsx('time', completed && 'completed', error && 'error')}>{formatTime(timeRemaining)}</span>

        <span className='timer-controls'>
          {' '}
          <button className='timer-button' onClick={isPaused || !isCountdownActive ? handleStart : handlePause}>
            {(() => {
              if (isCountdownActive && isPaused) {
                return 'Resume';
              } else if (isCountdownActive && !isPaused) {
                return 'Pause';
              } else {
                return 'Start';
              }
            })()}
          </button>
          <button
            className='timer-button'
            onClick={handleStop}
            disabled={!isCountdownActive && timeRemaining === time * 60 * 1000}
          >
            Stop
          </button>
        </span>
      </div>
    </>
  );
};

export { Timer };

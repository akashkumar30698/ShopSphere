import React, { useState, useEffect } from 'react';
import { useLogin } from '../../ContextApi/loginContext';

const Timer = () => {
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const {setShowTimer,reRenderOnCrossClick,setReRenderOnCrossClick,checkTrue,setCheckTrue,setLoading} = useLogin()

  const getTime = () => {
    const timeLeft = minutes * 60 * 1000 + seconds * 1000;

    
    if (timeLeft > 0) {
      setMinutes(Math.floor((timeLeft - 1000) / (1000 * 60)));
      setSeconds(Math.floor(((timeLeft - 1000) / 1000) % 60));
    } else {
      setMinutes(0);
      setSeconds(0);
    }


    if(timeLeft == 0){
         setShowTimer(false)
         setLoading(false)
         setReRenderOnCrossClick(!reRenderOnCrossClick)
         setCheckTrue(false)
    }
  };

  useEffect(() => {
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, [minutes, seconds]);

  return (
    <div className="text-white text-3xl font-bold">
      <div>Time Left:  {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s</div>
    </div>
  );
};

export default Timer;

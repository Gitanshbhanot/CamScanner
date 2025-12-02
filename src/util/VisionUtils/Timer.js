import React from 'react';
import useTimer from './useTimer';
import { useEffect, useState } from 'react';
import { CustomImg } from '../../Common/Components';
function Timer({ initialSeconds, callFunc, initialRender, setInitialRender }) {
  const seconds = useTimer(initialSeconds);
  useEffect(() => {
    if (!initialRender) {
      if (seconds === initialSeconds) {
        console.log('started the call');
        callFunc((prev) => !prev);
      }
    } else setInitialRender(false);
  }, [seconds, initialSeconds]);
  return (
    <div className="bg-white rounded-lg flex justify-center sm:justify-start gap-1 sm:gap-2 p-1 pl-3 pr-3 items-center w-fit">
      <p className="text-[#3E3C42] text-xxs sm:text-sm">Data will update in</p>
      <CustomImg src="/SizingIcons/Clock.svg" className="w-fit" />
      <p className="text-black font-medium text-xxs sm:text-sm">{seconds} s</p>
    </div>
  );
}
export default React.memo(Timer);

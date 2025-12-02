import React from 'react';
import { useWindowSize } from '@uidotdev/usehooks';

const GradientText = ({
  text,
  from,
  to,
  direction,
  fontSize,
  fontFamily,
  fontWeight,
}) => {
  const size = useWindowSize();

  return (
    <div
      className="bg-clip-text w-full font-semibold text-transparent truncate"
      style={{
        backgroundClip: 'text',
        backgroundImage: `linear-gradient(${direction}, ${from}, ${to})`,
        fontSize: size.width > 540 ? fontSize : '12px',
        color: 'transparent',
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        WebkitBackgroundClip: 'text',
      }}
      title={text}
    >
      {text}
    </div>
  );
};

export default GradientText;

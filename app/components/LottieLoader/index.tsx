import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef } from 'react';

const LottieLoader = ({animationData, customClass = '', loop = false,speed=1,onComplete = ()=> {}}) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  useEffect(()=>{
     if(lottieRef && lottieRef?.current)
      lottieRef.current.setSpeed(speed)
  },[speed])
  return <Lottie animationData={animationData ?? ''}
  lottieRef={lottieRef}
  className={"flex justify-center items-center " + (customClass ?? '')} loop={loop}
  onComplete={onComplete}
  />;
};

export default LottieLoader;

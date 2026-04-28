import {
  WiCloudy,
  WiDayCloudy,
  WiDaySunny,
  WiDaySunnyOvercast,
  WiFog,
  WiRain,
  WiRainMix,
  WiRainWind,
  WiShowers,
  WiSnow,
  WiSnowWind,
  WiSprinkle,
  WiStormShowers,
  WiThunderstorm,
} from 'react-icons/wi';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  value: number;
}

export function WeatherCodeIcon({ className, value }: Props) {
  switch (value) {
    case 0:
      return <WiDaySunny className={cn('size-6', className)} />;
    case 1:
      return <WiDaySunnyOvercast className={cn('size-6', className)} />;
    case 2:
      return <WiDayCloudy className={cn('size-6', className)} />;
    case 3:
      return <WiCloudy className={cn('size-6', className)} />;
    case 45:
    case 48:
      return <WiFog className={cn('size-6', className)} />;
    case 51:
    case 53:
    case 55:
      return <WiSprinkle className={cn('size-6', className)} />;
    case 56:
    case 57:
      return <WiRainMix className={cn('size-6', className)} />;
    case 61:
    case 63:
      return <WiRain className={cn('size-6', className)} />;
    case 65:
      return <WiRainWind className={cn('size-6', className)} />;
    case 66:
    case 67:
      return <WiRainMix className={cn('size-6', className)} />;
    case 71:
    case 73:
      return <WiSnow className={cn('size-6', className)} />;
    case 75:
      return <WiSnowWind className={cn('size-6', className)} />;
    case 77:
      return <WiSnow className={cn('size-6', className)} />;
    case 80:
    case 81:
      return <WiShowers className={cn('size-6', className)} />;
    case 82:
      return <WiStormShowers className={cn('size-6', className)} />;
    case 85:
      return <WiSnow className={cn('size-6', className)} />;
    case 86:
      return <WiSnowWind className={cn('size-6', className)} />;
    case 95:
      return <WiThunderstorm className={cn('size-6', className)} />;
    case 96:
    case 99:
      return <WiStormShowers className={cn('size-6', className)} />;
  }
}

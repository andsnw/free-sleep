import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, CircularProgress } from '@mui/material';

import AlarmDismissal from './AlarmDismissal.tsx';
import AwayNotification from './AwayNotification.tsx';
import PageContainer from '../PageContainer.tsx';
import PowerButton from './PowerButton.tsx';
import SideControl from '../../components/SideControl.tsx';
import Slider from './Slider.tsx';
import WaterNotification from './WaterNotification.tsx';
import { useAppStore } from '@state/appStore.tsx';
import { useControlTempStore } from './controlTempStore.tsx';
import { useDeviceStatus } from '@api/deviceStatus';
import { useSettings } from '@api/settings.ts';
import { useTheme } from '@mui/material/styles';
import PrimingNotification from './PrimingNotification.tsx';


export default function ControlTempPage() {
  const { isError, refetch } = useDeviceStatus();
  const { deviceStatus } = useControlTempStore();
  const { data: settings } = useSettings();
  const { isUpdating, side } = useAppStore();
  const theme = useTheme();

  const sideStatus = deviceStatus?.[side];
  const isOn = sideStatus?.isOn || false;

  useEffect(() => {
    refetch();
  }, [side]);

  return (
    <PageContainer
      sx={ {
        maxWidth: '500px',
        [theme.breakpoints.up('md')]: {
          maxWidth: '400px',
        },
      } }
    >
      <SideControl title={ 'Temperature' }/>
      <Slider
        isOn={ isOn }
        currentTargetTemp={ sideStatus?.targetTemperatureF || 55 }
        refetch={ refetch }
        currentTemperatureF={ sideStatus?.currentTemperatureF || 55 }
        displayCelsius={ settings?.temperatureFormat === 'celsius' || false }
      />
      { isError ? (
        <Button
          variant="contained"
          onClick={ () => refetch() }
          disabled={ isUpdating }
        >
          Try again
        </Button>
      ) : (
        <PowerButton isOn={ sideStatus?.isOn || false } refetch={ refetch }/>
      ) }
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1 } }>
        {
          deviceStatus?.isPriming && (
            <PrimingNotification/>
          )
        }
        <AwayNotification settings={ settings }/>
        <WaterNotification deviceStatus={ deviceStatus }/>
      </Box>
      <AlarmDismissal deviceStatus={ deviceStatus } refetch={ refetch }/>
      { isUpdating && <CircularProgress/> }
    </PageContainer>
  );
}

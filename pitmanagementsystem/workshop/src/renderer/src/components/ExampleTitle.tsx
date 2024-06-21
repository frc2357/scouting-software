import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { ReactElement, useEffect, useState} from 'react';

export const ExampleTitle: React.FC = (): ReactElement => {
  const [name, setName] = useState<string>("");

  useEffect(() =>{
    window.api.bluetoothPairingRequest((event, details) => {
      const response = {}
    
      switch (details.pairingKind) {
        case 'confirm': {
          response.confirmed = window.confirm(`Do you want to connect to device ${details.deviceId}?`)
          break
        }
        case 'confirmPin': {
          response.confirmed = window.confirm(`Does the pin ${details.pin} match the pin displayed on device ${details.deviceId}?`)
          break
        }
        case 'providePin': {
          const pin = window.prompt(`Please provide a pin for ${details.deviceId}.`)
          if (pin) {
            response.pin = pin
            response.confirmed = true
          } else {
            response.confirmed = false
          }
        }
      }
    
      window.api.bluetoothPairingResponse(response)
    })  
  }, [])

  async function testIt () {
    console.log("TEST IT");
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    })
    setName(device.name || `ID: ${device.id}`);
  }

  function cancelRequest () {
    window.api.cancelBluetoothRequest()
  }
 
  return (
    <Box
      sx={{
        marginLeft: '16px',
        height: '100%',
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4">Pit Management System: Workshop</Typography>
      <Button onClick={testIt}>Test Bluetooth</Button>
      <Button onClick={cancelRequest}>Cancel Bluetooth Request</Button>
      <Typography variant="h6">{name}</Typography>
     </Box>
  );
};

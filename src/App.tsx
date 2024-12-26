import React from 'react';
import { Box, Button } from '@chakra-ui/react';

function App() {

  const handleClick = () => { 
    alert('Button clicked');
  };

  return (
    <>
      <Box>This is the Box</Box>
      <Button onClick={handleClick}>This is the Button</Button>
    </>
  );
}

export default App;
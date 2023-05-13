import React, { useState } from 'react'
import Weather from './components/Weather';
function App() {
  const clear = 'clear';
  // const backgroundImage = clear === 'clear' ? 'url("./assets/clear.jpg")' : 'url("./assets/clouds.jpeg")';
  return (
<div>
      <Weather/>    
    </div>
  );
}

export default App;
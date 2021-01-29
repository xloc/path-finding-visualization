import React from 'react';
import './App.css'
import Grid from './Components/Grid';
import { parseRoutingMapString } from './Models/RouteMap';
import data from './routeMapData';

function App() {
  return (
    <div className="App">
      <Grid routeMap={parseRoutingMapString(data)} />
    </div>
  );
}

export default App;

import React, {useState} from 'react'
import RouteForm from "./components/RouteForm";
import 'antd/dist/antd.css'
import Example from "./Example";
import RouteView from "./components/RouteView";

function App() {
  const [currentRoute, setCurrentRoute] = useState([])
  return (
    <div className='h-screen w-screen flex bg-slate-500'>
      {/* <div className='flex flex-row h-full w-3/6 bg-slate-500'> */}

        <RouteForm />
        
      {/* <Example /> */}
    </div>
  );
}

export default App;

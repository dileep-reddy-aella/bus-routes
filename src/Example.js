// import {googleMapReact as GoogleMapReact} from 'google-map-react'
import GoogleMapReact from 'google-map-react'
import React from 'react'
import { stops } from './components/stops';
import Graph from 'graphology';
import {allSimplePaths} from 'graphology-simple-path';

const graph = new Graph();  

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Example = ({center = {lat: 17.3850, lng: 78.4867}, zoom = 11}) => {

  const [direction, setDirection] = React.useState(true)
  const [status, setStatus] = React.useState(true)
  const [source, setSource] = React.useState('')
  const [destination, setDestination] = React.useState('')
  const [routesList, setRoutesList] = React.useState([])
  // const [graph, ] = React.useState(new Graph(stops.length))

  React.useEffect(() => {
    stops.forEach((el, idx) => graph.addNode(idx))
    // graph.addNode(0);
    // graph.addNode(1);
    // graph.addNode(2);
    // graph.addNode(3);
    graph.mergeEdge(0, 1);
    graph.mergeEdge(0, 2);
    graph.mergeEdge(1, 2);
    graph.mergeEdge(2, 0);
    graph.mergeEdge(2, 1);
    graph.mergeEdge(1, 3);
  }, [])
  
  return (
    <div className='h-full w-full flex flex-row'>
      {/* <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCmwql6jVIv2yGfiOHYsgKEX-KgUk7mgPs'}}
        defaultCenter={center}
        defaultZoom={zoom}
        layerTypes={['TransitLayer']}
        styles={[{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]}
      >
      <AnyReactComponent
            lat={17.4486}
            lng={78.3908}
            text="MADHAPUR"
          />
      </GoogleMapReact> */}
      <div className='h-full w-3/6 bg-slate-700 text-white'>
        <p className='my-auto'>
          Please create a route by selecting the source and destination.
        </p>
      </div>
      <div className='h-full w-3/6 bg-gray-100 flex items-center justify-center'>
        <div className='h-5/6 w-5/6 bg-white border border-solid rounded py-6 px-5'>
          <div className='flex items-center justify-between my-3.5'>
            <input value={source} type='text' className='shadow py-2 px-2' onChange={(e) => setSource(e.target.value)} placeholder='Source' />
            <p>–></p>
            <input value={destination} type='text' className='shadow py-2 px-2' onChange={(e) => setDestination(e.target.value)} placeholder='Destination' />
          </div>
          <div className='flex items-center justify-between my-3.5'>
            <div className='flex justify-evenly w-full'>
              <p>Direction</p>
              <div className='flex flex-row justify-between ml-2'>
                <div>
                  <input checked={direction} className='hidden' id='up' type='radio' />
                  <label onClick={()=>setDirection(true)} className={`border border-solid p-1 ${direction && 'bg-blue-300'}`} htmlFor='up'>Up</label>
                </div>
                <div>
                  <input checked={!direction} className='hidden' id='down' type='radio' />
                  <label onClick={()=>setDirection(false)} className={`border border-solid p-1 ${!direction && 'bg-blue-300'}`}htmlFor='down'>Down</label>
                </div>
              </div>
            </div>
            <div className='flex justify-evenly w-full'>
              <p>Status</p>
              <div className='flex flex-row justify-between ml-2'>
                <div>
                  <input checked={status} className='hidden' id='active' type='radio' />
                  <label onClick={()=>setStatus(true)} className={`border border-solid p-1 ${status && 'bg-blue-300'}`} htmlFor='active'>Active</label>
                </div>
                <div>
                  <input checked={!status} className='hidden' id='inactive' type='radio' />
                  <label onClick={()=>setStatus(false)} className={`border border-solid p-1 ${!status && 'bg-blue-300'}`} htmlFor='inactive'>Inactive</label>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-around my-4'>
            <button onClick={() => setRoutesList(allSimplePaths(graph, parseInt(source), parseInt(destination)))} className='h-10 bg-blue-600 text-white rounded-md px-2.5'>Get List of Routes</button>
          </div>
          <div className='flex items-center justify-around my-6'>
            List of stops
          </div>
          <div className='flex items-center justify-around my-3.5'>
            Enter source and destination to display routes
          </div>
          <div>
            {routesList && routesList.map((r, idx) => <p key={idx}>{r.join(',')}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Example

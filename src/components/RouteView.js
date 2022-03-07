import React, { useRef } from 'react'
import GoogleMapReact from 'google-map-react';
import { Timeline, Tabs } from 'antd'
import { stops } from './stops'

const { TabPane } = Tabs;
const AnyReactComponent = ({ text }) => <div>{text}</div>;


const RouteView = ({currentRoute, polys, center = {lat: 17.3850, lng: 78.4867}, zoom = 16}) => {
  const [markers, setMarkers] = React.useState(polys)
  const mapRef = useRef(null)
  React.useEffect(() => {
   
  }, [currentRoute])

  const renderPolylines = (map, maps) => {
    let geodesicPolyline = new maps.Polyline({
      path: polys,
      geodesic: true,
      strokeColor: "#FF8033",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    })
    geodesicPolyline.setMap(map)
  }


  if (currentRoute) {
    return (
      <div className='w-full h-5/6'>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="List View" key="1">
            <div className='w-5/6 flex my-auto mx-auto'>
              <div className='w-96'>
                <div className='text-lg font-semibold mb-3'>Route</div>
                <Timeline>
                  {currentRoute?.routeIdx?.map((route, idx) => (<Timeline.Item key={idx}>{stops[route]?.name}</Timeline.Item>))}
                </Timeline>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Map View" key="2">
            <div style={{width: '600px', height: '500px', margin: 'auto'}}>
              <GoogleMapReact
                ref={mapRef}
                bootstrapURLKeys={{ key: 'AIzaSyCmwql6jVIv2yGfiOHYsgKEX-KgUk7mgPs'}}
                defaultCenter={polys[0]}
                defaultZoom={zoom}
                layerTypes={['TransitLayer']}
                onGoogleApiLoaded={({map, maps}) => renderPolylines(map, maps)}
                yesIWantToUseGoogleMapApiInternals={true}
                styles={[{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]}
              >
                { polys.map((point, id) => <AnyReactComponent className='text-lg font-semibold bg-gray-50' key={point.lat + point.lng} lat={point.lat} lng={point.lng} text={`Stop ${id}`} />) }
              </GoogleMapReact>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
  return (
    <div className='h-5/6 w-5/6 flex my-auto'>
      <div className='w-96'>
        <div className='text-lg font-semibold mb-3'>Please select a route to view details</div>
      </div>
    </div>
  )
}

export default RouteView

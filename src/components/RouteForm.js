import React, { useState, useEffect } from 'react'
import { Card, Select, Radio, Input, Button, List, Avatar, Tag } from 'antd'
import {DeleteOutlined, EditOutlined, TrophyOutlined}  from '@ant-design/icons'
import Graph from 'graphology';
import {allSimplePaths} from 'graphology-simple-path';
import { stops } from './stops'
import RouteView from './RouteView';


const { Option } = Select
const graph = new Graph();

const RouteForm = () => {
  const [step, changeStep] = useState(0)
  const [direction, setDirection] = useState('up')
  const [status, setStatus] = useState('active')
  const [source, setSource] = useState(null)
  const [destination, setDestination] = useState(null)
  const [routesList, setRoutesList] = useState([])
  const [indexRoutes, setIndexRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [storedRoutes, setStoredRoutes] = useState([])
  const [routeName, setRouteName] = useState(null)
  const [currentRoute, setCurrentRoute] = useState(null)
  const [update, setUpdate] = useState(false)
  const [updatingRoute, setUpdatingRoute] = useState(null)
  const [polys, setPolys] = useState(null)
  let rows = []
  let btnText = 'Add a new Route'

  useEffect(() => {
    stops.forEach((el, idx) => graph.addNode(idx))
    graph.mergeEdge(0, 1);
    graph.mergeEdge(0, 2);
    graph.mergeEdge(1, 2);
    graph.mergeEdge(2, 0);
    graph.mergeEdge(2, 1);
    graph.mergeEdge(1, 3);
    graph.mergeEdge(2, 4);
    graph.mergeEdge(3, 4);
  }, [])

  useEffect(() => {
    if ((source !== null) && (destination !== null)) {
      // setIndexRoutes([])
      let paths = allSimplePaths(graph, source, destination)
      let routes = []
      let idxRoutes = []
      paths.forEach(path => {
        let route = ''
        if (direction === 'down') {path = path.reverse()}
        idxRoutes.push([...path])
        path.forEach((stopIdx, index) => {
          route += index === 0 ? stops[stopIdx].name : ', ' + stops[stopIdx].name
        })
        routes.push(route)
      })
      if(update) {
        let idx = routesList.findIndex((route) => route === updatingRoute.route)
        setSelectedRoute(idx)
      }
      setIndexRoutes([...idxRoutes])
      setRoutesList([...routes])
    }
  }, [source, destination, direction])

  const createRoute = () => {
    let newRoute = {}
    if (!update) {
      newRoute = {
        id: Date.now(),
        routeIdx: indexRoutes[selectedRoute],
        route: routesList[selectedRoute],
        direction: direction,
        status: status,
        name: routeName
      }
      setStoredRoutes([...storedRoutes, newRoute])
    } else {
      let routes = storedRoutes.map((route) => {
        if (route.id === updatingRoute.id) {
          route.routeIdx = indexRoutes[selectedRoute]
          route.route = routesList[selectedRoute]
          route.direction = direction
          route.status = status
          route.name = routeName
        }
        return route
      })
      setStoredRoutes(routes)
      setUpdate(false)
      setUpdatingRoute(null)
    }
    setSource(null)
    setDestination(null)
    setDirection('up')
    setStatus('active')
    setRouteName(null)
    setCurrentRoute(null)
    setSelectedRoute(null)
    changeStep(0)
  }

  const viewRoute = (idx) => {
    let routes = storedRoutes[idx]?.routeIdx?.map((id) => ({lat: stops[id]?.lat, lng: stops[id]?.lng}))
    setPolys(routes)
    setCurrentRoute({...storedRoutes[idx]})
  }

  const goBack = () => {
    setSource(null)
    setDestination(null)
    setDirection('up')
    setStatus('active')
    setRouteName(null)
    setCurrentRoute(null)
    setSelectedRoute(null)
    changeStep(0)
  }

  const editRoute = (idx) => {
    let route = storedRoutes[idx]
    setUpdatingRoute(route)
    setUpdate(TrophyOutlined)
    setSource(route.routeIdx[0])
    setDestination(route.routeIdx[route.routeIdx.length - 1])
    setDirection(route.direction)
    setStatus(route.status)
    setRouteName(route.name)
    changeStep(1)
    setCurrentRoute(null)
  }

  const deleteRoute = (idx) => {
    let routes = storedRoutes.filter((route, index) => index !== idx)
    setCurrentRoute(null)
    setStoredRoutes([...routes])
  }

  if (step === 0) {
    rows = storedRoutes.map(route => ({title: route?.name, path: route?.route, status: route?.status, id: route?.id}))
  }

  return (
    <>
    <div className='flex flex-row h-full w-3/6 bg-slate-200 items-center justify-center'>
      <div className='h-5/6 w-5/6 flex my-auto'>
        <div className='w-96'>
          { step === 1 ?
            <>
            <div className='w-full flex justify-between my-4'>
              <Button onClick={() => goBack()}>{`<- Go Back`}</Button>
            </div>
            <div className='w-full flex justify-between my-4'>
              <Select
                showSearch 
                optionFilterProp="children" 
                placeholder='Stop 1'
                onChange={setSource}
                value={stops[source]?.name}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                className='w-32'
              >
                { stops.map((stop, index) => (<Option key={stop.id} value={index}>{stop.name}</Option>))}
              </Select>
              <Select
                showSearch 
                optionFilterProp="children" 
                placeholder='Stop 1'
                onChange={setDestination}
                value={stops[destination]?.name}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                className='w-32'
              >
                { stops.map((stop, index) => (<Option key={stop.id} value={index}>{stop.name}</Option>))}
              </Select>
              </div>
              <div className='w-full flex flex-col justify-between my-4 items-left'>
                <p className='text-sm -mb-0'>Direction</p>
                <Radio.Group onChange={e => setDirection(e.target.value)} value={direction} size="medium">
                  <Radio.Button value="up">Up route</Radio.Button>
                  <Radio.Button value="down">Down route</Radio.Button>
                </Radio.Group>
              </div>
              <div className='w-full flex flex-col justify-between my-4 mx-auto items-left'>
                <p className='text-sm -mb-0'>Status</p>
                <Radio.Group onChange={e => setStatus(e.target.value)} value={status} size="medium">
                  <Radio.Button value="active">Active</Radio.Button>
                  <Radio.Button value="inactive">Inactive</Radio.Button>
                </Radio.Group>
              </div>
              <div className='w-full flex justify-between my-4 mx-auto items-center'>
                <Select
                  showSearch 
                  optionFilterProp="children" 
                  value={selectedRoute && selectedRoute}
                  placeholder='Select stop 1, stop 2 and direction to see the routes'
                  onChange={val => setSelectedRoute(parseInt(val))}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  { routesList.map((route, idx) => <Option key={idx} value={idx}>{route}</Option>) }
                </Select>
              </div>
              <div className='w-full flex justify-between my-4 mx-auto items-center'>
                <Input defaultValue={routeName} onChange={e=>setRouteName(e.target.value)} placeholder='Enter route name' />
              </div>
              <div className='w-full flex justify-between my-4 mx-auto items-center'>
                <Button disabled={[source, destination, selectedRoute, routeName].includes(null) || (routeName?.length < 2)} 
                  onClick={createRoute}
                >
                  {update ? 'Update Route' : 'Create Route'}
                </Button>
              </div>
            </> :
              <>
                <div className='w-full flex justify-between my-4 text-lg font-semibold'>Saved Routes</div>
                <div className='w-full my-4'>
                  {rows.length < 1 ?
                    <p>Click the button below to create a new route</p> :
                    <List
                      itemLayout='horizontal'
                      dataSource={rows}
                      renderItem={(item, idx) => (
                        <>
                          <List.Item key={item.id} className='cursor-pointer'>
                            <List.Item.Meta
                              title={<div>{item.title}</div>}
                              description={item.path}
                              onClick={() => (item.status === 'active' ? viewRoute(idx) : null)}
                            />
                            {item.status === 'inactive' && <Tag color="red">Inactive</Tag>}
                            <EditOutlined onClick={()=>editRoute(idx)} className='mx-4 hover:scale-125'/>
                            <DeleteOutlined onClick={()=>deleteRoute(idx)} className='hover:scale-125'/>
                          </List.Item>
                        </>
                      )}
                    />
                  }
                </div>
                <div className='w-full flex justify-between my-4'>
                  <Button onClick={() => { changeStep(1); setCurrentRoute(null) }}>Add a new route</Button>
                </div>
              </>
          }
          </div>
      </div>
    </div>
    <div className='flex flex-row h-full w-3/6 bg-white items-center justify-center'>
      <RouteView currentRoute={currentRoute} polys={polys}/>
    </div>
    </>
  )
}

export default RouteForm

import React, { Component } from 'react'
import Loader from './Components/Loader'
import ChoroplethMap from './Components/maps/ChoroplethMap'
import DensityMap from './Components/maps/DensityMap'
import BubbleMap from './Components/maps/BubbleMap'
import SwipeMap from './Components/maps/SwipeMap'
import Chart from './Components/charts/Chart'
import { extractParams, getData } from './utils/services/dataSources';
import './App.css'

class WETChart extends Component {
  
  state = {
    markerRadius: 30,
    map: React.createRef(),
    chartData: [],
    loading: true,
  }
  
  bindFeatures = (feature, layer) => {
    layer.on({
      click: this.featureClick
    })
  }
  
  featureClick = (e) => {

    var layer = e.target
    const data = layer.feature.properties
    const dataSet = Object.keys(data).map(label => ({ label, value: Number(data[label]) }) )
    dataSet.splice('id', 1)
    this.setState({ chartData: dataSet })
  }
  
  componentDidMount() {
    // get and process url params
    const url = window.location.search
    const params = extractParams(url)
    const { property, property2, chart, center, title, mapType } = params
    // get data
    getData(params)
      .then(geoJson => 
        this.setState(
          { 
            geoJson,
            loading: false,
            property,
            property2,
            chart,
            mapType,
            center,
            title,
          }
        )      
      )
  }
  
  render() {
    const { chartData, geoJson, center, property, property2, title, chart } = this.state
    
    // loader while fetching data

    if (this.state.loading) return <Loader />

    // set map component
    let mapComponent
    switch(this.state.mapType) {
      case 'choroplet':
        mapComponent =  <ChoroplethMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
      case 'bubble':
        mapComponent =  <BubbleMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
      case 'density':
        mapComponent =  <DensityMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
      case 'swipe':
        mapComponent =  <SwipeMap center={center} data={geoJson} property={property} property2={property2} bind={this.bindFeatures}/>
        break
      default:
        mapComponent =  <ChoroplethMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
    }
    
    return (
      <div className="infoViz">
        {mapComponent}

      </div>
    )
  }
}

export default WETChart

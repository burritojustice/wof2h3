import h3 from "h3-js";
import geojson2h3 from 'geojson2h3';  // this needs h3-js 

// const geojson2h3 = require('geojson2h3');
import fs from 'fs';
//const fetch = require('node-fetch');
import fetch from 'node-fetch'
import argv from 'minimist'

var args = process.argv.slice(2)
const wof = args[0]
const resolution = args[1]

// var argv = require('minimist')(process.argv.slice(2));
// argv = argv["_"]
// console.dir(argv,argv[0],argv[1]);

async function getFeature(wof,resolution){
	wof = wof.toString()
	resolution = Number(resolution)
	const segments = Math.ceil(wof.length/3)
    var path = ''
    var i;
    for (i = 0; i < segments; i++) {
      path += wof.substr(i*3,3) + '/'
    }
    path = path + wof
//     console.log(path)
// 	const  url = 'https://data.whosonfirst.org/102/112/179/102112179.geojson'
	const url = `https://data.whosonfirst.org/${path}.geojson`
// 	const url = 'https://data.whosonfirst.org/859/225/83/85922583-alt-mapzen.geojson'
	var polygon = await fetch(url).then(r => r.json());
	
	console.log('WOF ID',polygon.id,polygon.properties['wof:name'])
	const regex = / /gi;
	const label = polygon.id + "_" + polygon.properties['wof:name'].replace(regex,"_")	
	
	if (polygon.properties['wof:geom_alt']){
		if (polygon.properties['wof:geom_alt'].includes('mapzen')) {
			console.log(polygon.properties['wof:geom_alt'])
			console.log('getting alt-mapzen geometry')
			var alt_url = `https://data.whosonfirst.org/${path}-alt-mapzen.geojson`
			polygon = await fetch(alt_url).then(r => r.json());
		}
	}

	const hexagons = geojson2h3.featureToH3Set(polygon, resolution);
	// -> ['8a2830855047fff', '8a2830855077fff', '8a283085505ffff', '8a283085506ffff']

	// grab the centroids and make a feature collection
	let features = hexagons.map(hex => {
		let coords = h3.h3ToGeo(hex);
		coords = [coords[1],coords[0]]
		const geom = {"type": "Point", "coordinates": coords}
		const feature = {
			id: hex,
			properties: {
				h3_id: hex,
				kind: "centroid",
				resolution: resolution
			},
			type: 'Feature',
			geometry: geom
		}
		return feature
	})
	console.log(features.length,"hexbins")
	
	const pointFeatureCollection = {
	   "type": "FeatureCollection",
       "features": features
	}	
// 	console.log(pointFeatureCollection)

	// const feature = geojson2h3.h3SetToFeature(hexagons);
	// -> {type: 'Feature', properties: {}, geometry: {type: 'Polygon', coordinates: [...]}}
	const hexProps = {
		'kind': 'hexbin',
		'resolution': resolution
	}
	var featureCollection = geojson2h3.h3SetToFeatureCollection(hexagons,hex => ({value: hexProps})) 
	

// 	console.log(featureCollection)

	fs.writeFileSync(label + "_" + resolution + '_h3_hexbins.geojson', JSON.stringify(featureCollection));
	fs.writeFileSync(label + "_" + resolution + '_h3_centroids.geojson', JSON.stringify(pointFeatureCollection));
}

// getFeature(102112179,7)
// getFeature(85922583,10)
getFeature(wof,resolution)




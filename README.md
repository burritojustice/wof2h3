# wof2h3

This node.js script takes a [Who's On First](https://whosonfirst.org/) identifier and an H3 resolution as input and generates an H3 hexgrid that fills the geometry specified by the WOF ID (city, region, country, continent...) It saves the hexbin grid and their centroids to two GeoJSON files.

```
$ node wof2h3.mjs 85688637 5
WOF ID 85688637 California
1574 hexbins
$ node wof2h3.mjs 85688637 6
WOF ID 85688637 California
10997 hexbins
$ node wof2h3.mjs 85688637 7
WOF ID 85688637 California
77011 hexbins
```
(If you're not familiar with Who's On First it's an open source gazetteer with stable identifiers. For example, California is, and always will be [85688637](https://spelunker.whosonfirst.org/id/85688637/). You can look up an WOF ID using the [Spelunker](https://spelunker.whosonfirst.org/).)

It generates two files named `wofid_wofname_h3resolution_kind.geojson`

- [85688637_California_5_h3_hexbins.geojson](data/85688637_California_5_h3_hexbins.geojson)
- [85688637_California_5_h3_centroids.geojson](data/85688637_California_5_h3_centroids.geojson)

![california_h3_r5_hexbins](images/california_h3_r5_hexbins.png)
![california_h3_r5_centroids](images/california_h3_r5_centroids.png)

The feature ID is the h3 index. 

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "852912dbfffffff",
      "properties": {
        "value": {
          "kind": "hexbin",
          "resolution": 5
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -119.04393751440749,
              33.42244126143113
            ]...
```

You can then dig in using whatever GeoJSON tools you prefer, such as [HERE Data Hub aka XYZ](https://www.here.xyz/) or Tangram and [Space Invader](https://s3.amazonaws.com/xyz-demo/scenes/xyz_tangram/index.html?space=zCOXmZmy&token=AE91crC4SyWB3zCSeH3HWwA&basemap=xyz-pixel&projection=mercator&demo=0&vizMode=xray&buildings=1&pattern=&patternColor=%2384c6f9&points=9&lines=0&outlines=2&places=1&roads=1&clustering=0&quadCountmode=mixed&quadRez=4&hexbins=0&voronoi=0&delaunay=0&water=0&tags=85688637_california_5_h3_hexagons&palette=viridis&paletteFlip=false&sort=count&hideOutliers=false&pointSizeProp=&pointSizeRange=%5B4%2C20%5D&propertySearch=%7B%7D#6.6833333333333345/37.416/-119.648) or https://geojson.tool

If an `alt_mapzen` [alternate geometry](https://whosonfirst.org/docs/geometries/alt/) is available, it will be used instead of the default WOF geometry. (Sorry Farallons.)

## What is this for?

I made this with the idea that high resolution H3 grids could be viewed at lower map zoom levels to create a dense dot density map or a pseudo heat map using intersections, or joins on the H3 IDs.  It's also interesting to see how h3 hexbins stack at different resolutions. 

![germany r4,5,6](images/germany_4_5_6.png)
[link](https://s3.amazonaws.com/xyz-demo/scenes/xyz_tangram/index.html?space=cQMGVs2y&token=AKkz6TS4RG6piCQnWro2gAA&basemap=xyz-pixel&projection=mercator&demo=0&vizMode=xray&buildings=1&pattern=&patternColor=%2384c6f9&points=9&lines=0&outlines=3&places=1&roads=0&clustering=0&quadCountmode=mixed&quadRez=4&hexbins=0&voronoi=0&delaunay=0&water=1&tags=85633111_germany_4_h3_hexbins%2C85633111_germany_5_h3_hexbins%2C85633111_germany_6_h3_hexbins&property=%40ns%3Acom%3Ahere%3Axyz.uuid&palette=colorBrewerBlue&paletteFlip=true&sort=values&hideOutliers=false&pointSizeProp=&pointSizeRange=%5B4%2C20%5D&propertySearch=%7B%7D#8.604166666666686/54.0643/9.5771)

![h3 viridis](images/h3_viridis.png)

And the h3 grid makes much more sense when you [don't use web mercator](https://s3.amazonaws.com/xyz-demo/scenes/xyz_tangram/index.html?space=mo5hYdrg&token=AImxjR4_RQqThipP0YT4agA&basemap=xyz-reduction-light&projection=globe&demo=0&vizMode=property&buildings=1&pattern=&patternColor=%2384c6f9&points=9&lines=0&outlines=2&places=0&roads=0&clustering=0&quadCountmode=mixed&quadRez=4&hexbins=0&voronoi=0&delaunay=0&water=1&tags=102191575_north_america_3_h3_hexbins&palette=viridis&paletteFlip=false&sort=count&hideOutliers=false&pointSizeProp=&pointSizeRange=%5B4%2C20%5D&propertySearch=%7B%7D#4.675000000000004/44.009/-98.993)

![north america space invader globe](images/north%20america_spherical.png)

But it also looks cool as just a space-filling pattern.

![us colors](images/us_cbpaired.png)

## Issues:

- `geojson2h3.featureToH3Set` only returns hexagons where the centroid falls within the provided polygon. While this makes sense when you have neighboring polygons, it would be nice to get all hexagons that touch a stand-alone polygon (if that's how you roll). [h3.polyfill](https://github.com/uber/h3-js#h3polyfillcoordinates-res-isgeojson--arrayh3index) returns an outline of the perimeter of the polygon, so maybe you could traverse that set and check if any of their edges are inside the source polygon?

## Questions:

I don't really know what I'm doing with node and got this to work through brute force and desperation and coffee and IPA. A few questions:

- Why did I need to `.mjs` and `import` instead of `const`? 
- How do I package this so you don't have to run around and grab dependencies?

## dependencies

- [h3.js](https://github.com/uber/h3-js)
- [geojson2h3](https://github.com/uber/geojson2h3)
- `fs`,`node-fetch`,`minimist` (for `argv`)



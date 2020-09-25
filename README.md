# wof2h3
Generate H3 hexgrids of an area using WOF IDs

This node.js script takes a WOF ID and an H3 resolution as input and generates an H3 hexgrid that fills the geometry specified by the WOF ID (city, region, country, continent...) It saves the hexbin grid and their centroids to two GeoJSON files.
```
  $ node wof2h3.mjs 85688637 6
  WOF ID 85688637 California
  10997 hexbins
```

This will generate two files:

[85688637_California_6_h3_hexagons.geojson](data/85688637_California_6_h3_hexagons.geojson)
[85688637_California_6_h3_centroids.geojson](data/85688637_California_6_h3_hexagons.geojson)

The feature IDs of the hexbins are the h3 IDs.

![california_h3_r5_hexbins](images/california_h3_r5_hexbins.png)
![california_h3_r5_centroids](images/california_h3_r5_centroids.png)

If an `alt_mapzen` [alternate geometry](https://whosonfirst.org/docs/geometries/alt/) is available, it will be used instead of the default WOF geometry. (Sorry Farallons.)

## What is this for?

I made this with the idea of generating high resolution H3 grids to be viewed at lower map zoom levels for a dot density map or to simulate a heat map. But it also looks cool as just a space-filling pattern. It's also interesting to see how h3 hexbins stack at different resolutions.

## Questions:

I am not a good node.js developer and got this to work through brute force and desperation. A few questions:

- Why did I need to `.mjs` and `import` instead of `const`? 
- How do I package this so you don't have to run around and grab dependencies?

## dependencies

[h3.js](https://github.com/uber/h3-js)
[geojson2h3](https://github.com/uber/geojson2h3)
'fs','node-fetch','minimist' (for argv)

[You can dig in using Space Invader](https://s3.amazonaws.com/xyz-demo/scenes/xyz_tangram/index.html?space=zCOXmZmy&token=AE91crC4SyWB3zCSeH3HWwA&basemap=xyz-pixel&projection=mercator&demo=0&vizMode=xray&buildings=1&pattern=&patternColor=%2384c6f9&points=9&lines=0&outlines=2&places=1&roads=1&clustering=0&quadCountmode=mixed&quadRez=4&hexbins=0&voronoi=0&delaunay=0&water=0&tags=85688637_california_5_h3_hexagons&palette=viridis&paletteFlip=false&sort=count&hideOutliers=false&pointSizeProp=&pointSizeRange=%5B4%2C20%5D&propertySearch=%7B%7D#6.6833333333333345/37.416/-119.648)

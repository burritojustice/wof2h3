# wof2h3
Generate H3 hexgrids of an area using WOF IDs

This node.js script takes a WOF ID and an H3 resolution as input and generates an H3 hexgrid that fills the geometry specified by the WOF ID (city, region, country, continent...) It saves the hexbin grid and their centroids to two GeoJSON files.

  $ node wof2h3.mjs 85688637 6
  WOF ID 85688637 California
  10997 hexbins
  
85688637_California_6_h3_hexagons.geojson
85688637_California_6_h3_centroids.geojson



It is not pretty code, but it works. I am not a good node.js developer and got this to work through brute force and desperation. A few questions:

- Why did I need to `.mjs` and `import` instead of `const`? 
- How do I package this so you don't have to run around and grab dependencies?

## dependencies

[h3.js](https://github.com/uber/h3-js)
[geojson2h3](https://github.com/uber/geojson2h3)
'fs','node-fetch','minimist' (for argv)


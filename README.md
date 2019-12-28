# Audio Visualizer
A simple audio visualizer module for front-end js applications.

# Usage
Use the examples to guide you through using the package. More detailed usage guide will be written at some point in the future.

# Customization
The colors of the visualizer is customizable by passing an object to the style parameter of the contructor.

This object has 4 properties
- back -> The background color
- line -> The color of the graph line
- progress -> The color of the progress bar
- lineWidth -> The pixel width of the visualizer graph

Example

```javascript
const style = { 
    back: '#1c2541', 
    line: '#f56476', 
    progress: 'rgba(211, 76, 85, 0.2)',
    lineWidth: 2
}
```

# Example / Testing
Use parcel to bundle the code. Read more here: https://parceljs.org/getting_started.html

# Install Parcel
```
npm i -g parcel-bundler
```

# Dev server
```
parcel index.html
```

# Build
```
parcel build index.html
```
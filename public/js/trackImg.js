captured = false;

trackImage = function trackImage(context, cb) {

  var FastTracker = function() {
    FastTracker.base(this, 'constructor');
  };
  tracking.inherits(FastTracker, tracking.Tracker);
  tracking.Fast.THRESHOLD = 2.2;
  FastTracker.prototype.threshold = tracking.Fast.THRESHOLD;
  FastTracker.prototype.track = function(pixels, width, height) {
    stats.begin();
    var gray = tracking.Image.grayscale(pixels, width, height);
    var corners = tracking.Fast.findCorners(gray, width, height);
    stats.end();
    if(!captured){
      this.emit('track', {
        data: corners
      });
    }
    captured = true;
  };
  

  var tracker = new FastTracker();
  
  tracker.on('track', function(event) {

    context.clearRect(0, 0, canvas.width, canvas.height);
    var corners = event.data;
    // console.log("tracked corners ", corners);
    cb(corners);
    for (var i = 0; i < corners.length; i += 2) {
      context.fillStyle = '#f00';
      context.fillRect(corners[i], corners[i + 1], 2, 2);
    }
  });

  tracking.track('#video', tracker, { camera: true });

}

findAndDrawFeatures = function(layer1, layer2, image) {

  var context1 = layer1.getContext("2d");
  var context2 = layer2.getContext("2d");

  if(image) {
    context1.clearRect(0, 0, layer1.width, layer1.height);
    context1.drawImage(image, 0, 0, layer1.width, layer1.height);
  }
  var imageData = context1.getImageData(0, 0, layer1.width, layer1.height);
  var gray = tracking.Image.grayscale(imageData.data, layer1.width, layer1.height);
  var corners = [];
  // get sets of corners at different FAST thresholds
  tracking.Fast.THRESHOLD = 34.0;
  corners.push(tracking.Fast.findCorners(gray, layer1.width, layer1.height));
  tracking.Fast.THRESHOLD = 21.0;
  corners.push(tracking.Fast.findCorners(gray, layer1.width, layer1.height));
  tracking.Fast.THRESHOLD = 13.0;
  corners.push(tracking.Fast.findCorners(gray, layer1.width, layer1.height));
  tracking.Fast.THRESHOLD = 8.0;
  corners.push(tracking.Fast.findCorners(gray, layer1.width, layer1.height));
  // tracking.Fast.THRESHOLD = 5.0;
  // corners.push(tracking.Fast.findCorners(gray, layer1.width, layer1.height));
  // console.log(corners);
  // de-dupe by "octave"
  var octaves = processCorners(corners);

  // draw each "octave"
  var colors = ["#EF2F00", "#9EF200", "#00F479", "#0058F7", "#C500F9"];
  for (var i = octaves.length-1; i >= 0; i--) {
    var octave = octaves[i];
    // console.log("events in octave " + i + ": " + octaves[i].length);
    for (var j = 0; j < octave.length; j++) {
      context2.fillStyle = colors[i];
      context2.fillRect(octave[j][0], octave[j][1], 3, 3);
    }
  };
  currentData = octaves;

}
// de-dupe in ascending order to get the unique x/y pairs from the features
processCorners = function processCorners(data) {
  var quantize = 20; // must be an even number minimum 2
  var octaves =[]; // set of arrays of x/y pair objects, top level arrays are "octave" data
  for (var i = 0; i < data.length; i++) {
    octaves[i] = [];
    for (var j = 0; j < data[i].length-quantize; j+=quantize) {
      var pair = [
        data[i][j],
        data[i][j+1]
      ];
      octaves[i].push(pair);
      // if(i>0) {
      //   if(_.where(octaves[i-1], pair).length === 0) {
      //     octaves[i].push(pair);
      //   }
      // } else {
      //   octaves[i].push(pair);
      // }
    }
    if(i>0) {
      octaves[i] = _.difference(octaves[i], octaves[i-1]);
    }
  }
  return octaves;
}

drawDataURIOnCanvas = function drawDataURIOnCanvas(strDataURI, canvas, cb) {
    
    "use strict";
    var img = new window.Image();
    img.addEventListener("load", function () {
        canvas = canvas;
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        cb();
    });
    img.setAttribute("src", strDataURI);
}

drawToImage = function drawToImage(v,context, canvas) {

  if(v.paused || v.ended) return false; // if no video, exit here
  // context.drawImage(v,0,0,canvas.width,canvas.height); // draw video feed to canvas // done with findAndDrawFetures
  var uri = canvas.toDataURL("image/png"); // convert canvas to data URI
  // console.log(uri); // uncomment line to log URI for testing
  imgtag.src = uri; // add URI to IMG tag src
}

getCamera = function() {

  var video = document.querySelector("#video");
  // check for getUserMedia support
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  if (navigator.getUserMedia) {       
    // get webcam feed if available
    navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
  function handleVideo(stream) {
    // if found attach feed to video element
    video.src = window.URL.createObjectURL(stream);
    // console.log(video.width);
  }
  function videoError(e) {
    // no webcam found - do something
  }
}

pauseCamera = function() {

  var video = document.querySelector("#video");
  video.pause();
}

makeStatsGUI = function makeStatsGUI() {
  // GUI Controllers
  var gui = new dat.GUI();
  gui.add(tracker, 'threshold', 1, 50).onChange(function(value) {
    tracking.Fast.THRESHOLD = value;
  });
}


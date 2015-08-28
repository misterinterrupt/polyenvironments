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
    console.log("tracked corners ", corners);
    cb(corners);
    for (var i = 0; i < corners.length; i += 2) {
      context.fillStyle = '#f00';
      context.fillRect(corners[i], corners[i + 1], 2, 2);
    }
  });

  tracking.track('#video', tracker, { camera: true });

}

findAndDrawFeatures = function(image, layer1, layer2) {

  var context1 = layer1.getContext("2d");
  var context2 = layer2.getContext("2d");

  tracking.Fast.THRESHOLD = 2.2;
  context1.drawImage(image, 0, 0, layer1.width, layer1.height);
  
  var imageData = context1.getImageData(0, 0, layer1.width, layer1.height);
  var gray = tracking.Image.grayscale(imageData.data, layer1.width, layer1.height);
  var corners = [];
  var corners[0] = tracking.Fast.findCorners(gray, layer1.width, layer1.height);
  tracking.Fast.THRESHOLD = 1.6;
  var corners[1] = tracking.Fast.findCorners(gray, layer1.width, layer1.height);
  tracking.Fast.THRESHOLD = 2.0;
  var corners[2] = tracking.Fast.findCorners(gray, layer1.width, layer1.height);
  tracking.Fast.THRESHOLD = 2.2;
  var corners[3] = tracking.Fast.findCorners(gray, layer1.width, layer1.height);
  tracking.Fast.THRESHOLD = 2.4;
  var corners[4] = tracking.Fast.findCorners(gray, layer1.width, layer1.height);
  var data = processCorners(corners);

}

processCorners = function processCorners(data) {
  console.log(data);
  for (var i = 0; i < corners.length; i += 2) {
    context2.fillStyle = '#0f0';
    context2.fillRect(corners[i], corners[i + 1], 3, 3);
  }
  var processed = {};
  return processed;
}

drawToImage = function drawToImage(v,context, canvas) {

  if(v.paused || v.ended) return false; // if no video, exit here
  // context.drawImage(v,0,0,canvas.width,canvas.height); // draw video feed to canvas // done with findAndDrawFetures
  var uri = canvas.toDataURL("image/png"); // convert canvas to data URI
  console.log(uri); // uncomment line to log URI for testing
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
    console.log(video.width);
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


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

findAndDrawFeatures = function(image, canvas) {
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  tracking.Fast.THRESHOLD = window.fastThreshold;
  context.drawImage(image, 0, 0, width, height);
  var imageData = context.getImageData(0, 0, width, height);
  var gray = tracking.Image.grayscale(imageData.data, width, height);
  var corners = tracking.Fast.findCorners(gray, width, height);
  for (var i = 0; i < corners.length; i += 2) {
    context.fillStyle = '#fff';
    context.fillRect(corners[i], corners[i + 1], 3, 3);
  }
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


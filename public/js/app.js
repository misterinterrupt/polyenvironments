window.irq = window.irq || {};
window.irq.SiS = window.irq.SiS || {};

$(document).ready(function() {

  // kick off the cloud process
  function initApp(p) {
    // shoving specifics about the sketch into global
    window.irq.SiS.xyPad1 = {};
    window.irq.SiS.xyPad1.w = parseInt($('#control-pad-1').css('width'),10);
    window.irq.SiS.xyPad1.h = parseInt($('#control-pad-1').css('height'),10);
    p.setup = function() {
      p.size(window.irq.SiS.xyPad1.w, window.irq.SiS.xyPad1.h);
      p.background(0,256);//background black alpha 1
      p.frameRate(24);
      p.noLoop();
      //change the size on resize
      $(window).resize(function() {
        window.irq.SiS.xyPad1.w = parseInt($('#control-pad-1').css('width'),10);
        window.irq.SiS.xyPad1.h = parseInt($('#control-pad-1').css('height'),10);
        p.size(window.irq.SiS.xyPad1.w, window.irq.SiS.xyPad1.h);
      });
    };
    window.irq.SiS.p = p;
    var $display, $instructions, $title;
    $display = $("#status");
    $instructions = $("#instructions");

    function handleClick(event) {
      $instructions.hide();
      $display.off("click");
      // HEY: start the app here
      window.irq.SiS.start();
    }
    $display.on("click", handleClick);
  }

  // set up processing first
  // it is essentially the app UI
  var xyPad = document.getElementById('control-pad-1');
  var processing = new Processing(xyPad, initApp);

});

(function(exports) {

  // App code
  var displayMessage = null;
  var masterContext = null;
  var loadProxy = null;
  var audioPath = "audio/";
  var soundInstance = null;
  var sources = [
    {id:"FLAPPY", src:"flappy.ogg"},
    {id:"PIGS6", src:"PIGS6.ogg"},
    {id:"TICKLES", src:"TICKLES.mp3"}
  ];
  var clouds = [];
  var sounds = [];
  var config;
  var orientation = {
    tiltLR: 0.0,
    tiltFB: 0.0,
    pointing: 0.0
  };

  // kick off the control data setup and the creation of clouds
  function start() {
    displayMessage = document.getElementById("status");
    if (!createjs.Sound.initializeDefaultPlugins() || !window.DeviceOrientationEvent) {
      document.getElementById("error").style.display = "block";
      document.getElementById("content").style.display = "none";
      return;
    }
    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
      // gamma is the left-to-right tilt in degrees, where right is positive
      var tiltLR = eventData.gamma;
      // beta is the front-to-back tilt in degrees, where front is positive
      var tiltFB = eventData.beta;
      // alpha is the compass direction the device is facing in degrees
      var pointing = eventData.webkitCompassHeading ? eventData.webkitCompassHeading : eventData.alpha;
      orientation.tiltLR = tiltLR;
      orientation.tiltFB = tiltFB;
      orientation.pointing = pointing; // null on laptops
    }, false);

    $(displayMessage).append("<p>loading audio</p>");
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    createjs.Sound.alternateExtensions = ["mp3"];
    var loadProxy = createjs.proxy(handleLoad);
    createjs.Sound.addEventListener("fileload", loadProxy);
    sounds = createjs.Sound.registerSounds(sources, audioPath);
    console.log('Resgistered sounds', sounds);
    masterContext = createjs.Sound.activePlugin.context;
  }

  function handleLoad(event) {
    if(event.id ==="TICKLES") {
      var sound = createjs.Sound.createInstance(event.id);
      $(displayMessage).append('<p>You can turn up your volume now</p>');
      createCloud(sound);
    }
  }

  // make a grain cloud
  function createCloud(sound) {
    clouds[sound.id] = new Cloud(sound, masterContext);
    clouds[sound.id].startGrains();
  }

  exports.start = start;
  exports.orientation = orientation;

  function grain(context, cloudGain, buffer, position, amp, pan, trans, length, attack, release) {

    var now = context.currentTime; // update the time value
    var source = context.createBufferSource();
    source.playbackRate.value = source.playbackRate.value * trans;
    source.buffer = buffer;
    var envelopeGain = context.createGain();
    var panner = context.createPanner();
    panner.panningModel = "equalpower";
    panner.distanceModel = "linear";
    panner.setPosition(pan, 0.0, 1.0);
    source.connect(panner);
    panner.connect(envelopeGain);
    envelopeGain.connect(cloudGain);
    source.start(now, position, length); // parameters (when,offset,duration)
    envelopeGain.gain.setValueAtTime(0.0, now);
    envelopeGain.gain.linearRampToValueAtTime(amp, now + attack);
    envelopeGain.gain.linearRampToValueAtTime(0, (now + length) - release );

    //garbagio collectionism
    var endTimes = now + length + 0.1;
    source.stop(endTimes);
    var ttl = length * 1000 + 200;
    setTimeout(function() {
      envelopeGain.disconnect();
      panner.disconnect();
      source.disconnect();
    }, ttl);
  }

  // a cloud of grains
  function Cloud(sound, masterContext, cloudParams, grainParams) {
    console.log('new cloud');
    // connect the cloud gain node to the context destination
    var cloudGain = masterContext.createGain();
    cloudGain.connect(masterContext.destination);
    cloudGain.gain.setValueAtTime(1.0, masterContext.currentTime);
    // timeout responsible for calling makeGrain continually
    var sprayTimeout;
    var grainCount = 0;

    // times are ms or a function that returns ms
    var defaultCloudParams = {
      // speed factor with which grains are created
      interval: 180,
      // max grain polyphony for this cloud
      density: 14,
      // max amplitude of grains, adjust for amount of doubling
      amp: 0.50,
      // random position amount
      jitter: 0.2,
      // random pan amount
      spread: 3.0,
      // length in s of each grain
      grainLength: 3,
      // start of area in sound usable for grain positions
      startGrainWindow: 0.85,
      // end of area in sound usable for grain positions
      endGrainWindow: 0.90
    };
    // times are in seconds
    var defaultGrainParams = {
      attack:  0.5,
      release: 0.5,
      pan: 0.0,
      trans: 1.0
    };

    // TODO: take params from args
    cloudParams = defaultCloudParams;
    grainParams = defaultGrainParams;

    // TODO: check for functions in params that can be dynamic or static
    function grainPosition(buffer) {
      // position is based on cloud's grain window
      var positionRatio = irq.SiS.p.map(irq.SiS.orientation.pointing, 0.0, 360.0, 0.01, 0.99);
      var windowRatio = cloudParams.endGrainWindow - cloudParams.startGrainWindow;
      var windowSize = windowRatio * buffer.duration;
      var windowStart = cloudParams.startGrainWindow * buffer.duration;
      return windowStart + (windowSize * positionRatio);
    }

    function grainPan() {
      // grainParams.pan
      return irq.SiS.p.map(irq.SiS.orientation.tiltLR, -180.0, 180.0, -10.0, 10.0);
    }

    function grainTrans() {
      // grainParams.trans
      return irq.SiS.p.map(irq.SiS.orientation.tiltFB, -180.0, 180.0, 0.6, 1.6);
    }

    function grainLength() {
      return cloudParams.grainLength * irq.SiS.p.map(irq.SiS.p.mouseY, irq.SiS.xyPad1.h, 0.0, 0.01, 1.0);
    }

    function grainInterval() {
      return cloudParams.interval * irq.SiS.p.map(irq.SiS.p.mouseX, 0.01, irq.SiS.xyPad1.w, 0.5, 0.999);
    }

    // create grains
    function makeGrain() {
      var buffer = sound.playbackResource;
      var position = grainPosition(buffer);
      var pan = grainPan();
      var amp = cloudParams.amp;
      var trans = grainTrans();
      var length = grainLength();
      var attack = grainParams.attack;
      var release = grainParams.release;
      var g = grain(masterContext, cloudGain, buffer, position, amp, pan, trans, length, attack, release);
      sprayTimeout = setTimeout(makeGrain, grainInterval());
    }

    function startGrains() {
      makeGrain();
    }

    function stopGrains() {
      clearTimeout(sprayTimeout);
    }

    return {
      startGrains: startGrains,
      stopGrains: stopGrains
    };
  }

}(window.irq.SiS));

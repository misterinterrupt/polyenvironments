window.irq = window.irq || {};

$( document ).ready(function() {

  // kick off the cloud process
  function initSound(p) {
    window.irq.p = p;
    var display;
    display = $("#status");
    function handleClick(event) {
      display.off("click");
      // HEY: start the app here
      window.irq.SiS.start();
    }
    display.on("click", handleClick);
  }

  // set up processing first
  // it is essentially the app UI
  var canvas2 = document.getElementById('canvas2');
  var processing = new Processing(canvas2,function(p) {
    // shoving specifics about the sketch into global
    window.irq.w = parseInt($('#canvas2').css('width'),10);
    window.irq.h = parseInt($('#canvas2').css('height'),10);
    p.setup = function() {
      console.log('processing, anyone? ', p);
      p.size(window.irq.w, window.irq.h);
      p.background(0,1);//backgorund black alpha 0
      p.frameRate(24);
      p.noLoop();
      //change the size on resize
      $(window).resize(function() {
        window.irq.w = parseInt($('#canvas2').css('width'),10);
        window.irq.h = parseInt($('#canvas2').css('height'),10);
        p.size(window.irq.w, window.irq.h);
      });
      return initSound(p);
    };
  });

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
      var pointing = eventData.alpha;
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
      $(displayMessage).append('<p>Created a sound</p>');
      createCloud(sound);
    }
  }

  // make a grain cloud
  function createCloud(sound) {
    clouds[sound.id] = new Cloud(sound, masterContext);
    clouds[sound.id].startGrains();
  }

  exports.SiS = {
    start: start,
    orientation: orientation
  };

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
      interval: 60,
      // max grain polyphony for this cloud
      density: 12,
      // random position amount
      jitter: 0.2,
      // random pan amount
      spread: 3.0,
      // length in s of each grain
      grainLength: 0.5
    };
    // times are in seconds
    var defaultGrainParams = {
      attack:  0.1,
      release: 0.2,
      pan: 0.0,
      trans: 1.0
    };

    // TODO: take params from args
    cloudParams = defaultCloudParams;
    grainParams = defaultGrainParams;

    // TODO: check for functions in params that can be dynamic or static
    function grainPosition(buffer) {
      var position_ratio = irq.p.map(irq.SiS.orientation.pointing, 0.0, 360.0, 0.0, 0.999);
      return buffer.duration * position_ratio;
    }

    function grainPan() {
      // grainParams.pan
      return irq.p.map(irq.SiS.orientation.tiltLR, -180.0, 180.0, -10.0, 10.0);
    }

    function grainTrans() {
      // grainParams.trans
      return irq.p.map(irq.SiS.orientation.tiltFB, -180.0, 180.0, 0.6, 1.6);
    }

    // create grains
    function makeGrain() {
      var buffer = sound.playbackResource;
      var position = grainPosition(buffer);
      var pan = grainPan();
      var amp = 0.9;
      var trans = grainTrans();
      var length = cloudParams.grainLength;
      var attack = grainParams.attack;
      var release = grainParams.release;
      var g = grain(masterContext, cloudGain, buffer, position, amp, pan, trans, length, attack, release);
      sprayTimeout = setTimeout(makeGrain, cloudParams.interval);
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

}(window.irq));

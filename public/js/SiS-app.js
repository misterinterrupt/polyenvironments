window.irq = window.irq || {};
window.irq.SiS = window.irq.SiS || {};

// the code that the app runs
(function(exports) {

  // App code
  var displayMessage = null;
  var masterContext = null;
  var loadProxy = null;
  var audioPath = "audio/";
  // var soundInstance = null;
  var clouds = {};
  var config;
  var orientation = {
    tiltLR: 0.0,
    tiltFB: 0.0,
    pointing: 0.0
  };
  // var lastIdx = 0;
  // var lastInterval;

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

    $(displayMessage).html("<img src='/images/loader_10_trans.gif'/>");
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    createjs.Sound.alternateExtensions = ["mp3"];
    var loadProxy = createjs.proxy(handleLoad);
    createjs.Sound.addEventListener("fileload", loadProxy);

    originSound = createjs.Sound.registerSound(
      audioPath + irq.SiS.relativeZones[0].source.file,
      irq.SiS.relativeZones[0].source.id,
      irq.SiS.relativeZones[0].source.channels);
    console.log('Registered origin sound', originSound);

    // assign soundjs plugin context to masterContext for use by clouds & grains
    masterContext = createjs.Sound.activePlugin.context;
  }

  // origin sound registered in start()
  // origin sound load handled
  // lastInterval set with transitionMonitor
  // interval picks up positive transition condition
  // clears lastInterval
  // new sound registered
  // load handled
  // lastInterval set with transitionMonitor

  function handleLoad(event) {
    var sound = createjs.Sound.createInstance(event.id);
    $(displayMessage).html('<p>adjust your volume to a comfortable level</p>');
    createCloud(sound, event.id);
    // should continually pay attention
    // handleLoad will be the 1st to trigger it
    // (via the 1 time payattention func)
    // then it becomes triggered by it
    if(payAttention) payAttention();
  }

  // starts and stops the cloud for zones based on active status
  function zoneActivityMonitor() {
    window.irq.SiS.relativeZones.forEach(function(zone) {
      if(zoneIsActive(zone.locationFromCenter)) {
        // if this zone is active, turn on the zone
        if(clouds[zone.source.id] && !clouds[zone.source.id].isPlaying()) {
          // if the cloud exists, and is not playing start playing grains
          clouds[zone.source.id].startGrains();
        } else if(!clouds[zone.source.id]){
          // if the cloud does not exist, register the sound
          createjs.Sound
            .registerSound(audioPath + zone.source.file,
              zone.source.id,
              zone.source.channels);
          console.log('Registered a sound', zone.source.id);
        }
      } else {
        // if this zone is not active, turn off the zone
        if(clouds[zone.source.id] && clouds[zone.source.id].isplaying()) {
          // if the cloud exists, and is playing, stop spraying grains
          clouds[zone.source.id].stopGrains();
        }
      }
    });
    setTimeout(zoneActivityMonitor, 987);
  }

  //
  // function transitionMonitor() {
  //   var transitionTo = enteredNewZone();
  //   if((transitionTo !== null) && (transitionTo >= 0)) {
  //     clearInterval(irq.SiS.lastInterval);
  //     var nextId = event.id;
  //     var nextIdx = getZoneIdxById(nextId, irq.SiS.relativeZones);
  //     clouds[nextIdx-1].stopGrains();
  //     var soundSource = irq.SiS.relativeZones[nextIdx].source;
  //     nextSound = createjs.Sound.registerSound(audioPath + soundSource.file, soundSource.id, soundSource.channels);
  //     console.log('Registered next sound', nextSound);
  //   }
  // }

  function getZoneIdxById(id, zones) {
    var idx;
    for(var i=0; i<zones.length; i++) {
      if(zones[i].source.id === id) {
        idx = i;
      }
    }
    return idx;
  }

  // make a grain cloud
  function createCloud(sound, id) {
    clouds[id] = new Cloud(sound, masterContext);
    clouds[id].startGrains();
  }

  function zoneIsActive(locationFromCenter) {
    return true;
  }

  function payAttention() {
    // kick off zone activity monitor
    if(payAttention) setTimeout(zoneActivityMonitor, 1000);
    payAttention = false;
  }
  // function enteredNewZone() {
  //   return 0;
  // }

  exports.start = start;
  exports.orientation = orientation;

  function grain(context, cloudGain, buffer, start, position, amp, pan, trans, length, attack, release) {


    var source = context.createBufferSource();
    source.playbackRate.value = source.playbackRate.value * trans;
    source.buffer = buffer;
    // source.loop = true;
    var envelopeGain = context.createGain();
    var panner = context.createPanner();
    panner.panningModel = "equalpower";
    panner.distanceModel = "linear";
    panner.setPosition(pan, 0.0, 1.0);
    source.connect(panner);
    panner.connect(envelopeGain);
    envelopeGain.connect(cloudGain);
    source.start(start, position, length); // parameters (when,offset,duration)
    envelopeGain.gain.setValueAtTime(0.0, context.currentTime);
    envelopeGain.gain.setValueAtTime(0.0, start);
    envelopeGain.gain.linearRampToValueAtTime(amp, start + attack);
    envelopeGain.gain.linearRampToValueAtTime(0, (start + length) - release);

    // //garbagio collectionism
    // var endTimes = start + length + 0.1;
    // source.stop(endTimes);
    // var ttl = length * 1000 + 200;
    // setTimeout(function() {
    //   envelopeGain.disconnect();
    //   panner.disconnect();
    //   source.disconnect();
    // }, ttl);
  }

  // a cloud of grains
  function Cloud(sound, masterContext, cloudParams, grainParams) {
    console.log('new cloud');
    var startTime = masterContext.currentTime; // update the time value
    var playing = false;
    // connect the cloud gain node to the context destination
    var cloudGain = masterContext.createGain();
    cloudGain.connect(masterContext.destination);
    cloudGain.gain.setValueAtTime(1.0, masterContext.currentTime);
    // timeout responsible for calling makeGrain continually
    var sprayTimeout;

    // times are ms or a function that returns ms
    var defaultCloudParams = {
      // speed factor with which grains are created
      interval: 1000,
      // ms grain spacing
      density: 100,
      // max grain polyphony for this cloud
      // grainCount: 6,
      // max amplitude of grains, adjust for amount of doubling
      amp: 0.40,
      // random position amount
      jitter: 0.25,
      // random pan amount
      spread: 3.0,
      // length in s of each grain
      grainLength: 1,
      // start of area in sound usable for grain positions
      startGrainWindow: 0.01,
      // end of area in sound usable for grain positions
      endGrainWindow: 0.99
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
      return cloudParams.grainLength * irq.SiS.p.map(irq.SiS.p.mouseY, irq.SiS.xyPad1.h, 0.0, 0.1, 1.0);
    }

    function cloudDensity() {
      return cloudParams.density * irq.SiS.p.map(irq.SiS.p.mouseX, 0.01, irq.SiS.xyPad1.w, 0.8, 2.0);
    }

    function msFromContextTime(time) {
      return parseInt( (time % 1) * 1000 + (parseInt(time) * 1000) );
    }

    // create grains
    function makeGrain() {
      var now = masterContext.currentTime;
      var now_ms = msFromContextTime(now);
      var startTime_ms = msFromContextTime(startTime);
      var tickLength = cloudParams.interval * 2;
      var timeout = cloudParams.interval;
      var timeToFill = grainTimeToFill(now_ms, startTime_ms, tickLength, timeout);
      var offsetTime = timeToFill/cloudDensity();

      var buffer = sound.playbackResource;
      var position = grainPosition(buffer);
      var pan = grainPan();
      var amp = cloudParams.amp;
      var trans = grainTrans();
      var length = grainLength();
      var attack = grainParams.attack;
      var release = grainParams.release;

      for (var i = 0; i < offsetTime; i++) {
        var offsetStart = now_ms + (cloudDensity() * i);
        var rnd = Math.floor(Math.random() + cloudParams.jitter);
        offsetStart += rnd * cloudDensity();
        grain(masterContext, cloudGain, buffer, offsetStart/1000, position, amp, pan, trans, length, attack, release);
      }
      sprayTimeout = setTimeout(makeGrain, timeout);
    }

    function grainTimeToFill(now, startTime, tickLength, timeout) {
      var timeElapsedSinceStart = now - startTime;
      var timePastLastTick = timeElapsedSinceStart % tickLength; // amount of time past last absolute tick
      var lastTick = now - timePastLastTick;
      var twoTicksFromNow = lastTick + (tickLength * 2);
      if(now < twoTicksFromNow/2) return (tickLength * 2); // current and the next tick of time have been filled
      var timeToSequence = timePastLastTick + (tickLength * 2); // amount of time before two ticks after last tick
      // we should have one tick of time to fill, unless some unforseen skip..
      // assert.true(timeToSequence === twoTicksFromNow - latestSequencedEventTime);
      return timeToSequence;
    }

    function startGrains() {
      makeGrain();
      playing = true;
    }

    function stopGrains() {
      clearTimeout(sprayTimeout);
      playing = false;
    }

    function isPlaying() {
      return !!playing;
    }

    return {
      startGrains: startGrains,
      stopGrains: stopGrains,
      isPlaying: isPlaying
    };
  }

}(window.irq.SiS));

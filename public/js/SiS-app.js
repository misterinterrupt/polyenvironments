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
    irq.SiS.registeredSounds = {};
    irq.SiS.registeredSounds[irq.SiS.relativeZones[0].source.id] = true;
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
        } else if(!clouds[zone.source.id] && !irq.SiS.registeredSounds[zone.source.id]) {
          // if the cloud does not exist, register the sound
          irq.SiS.registeredSounds[zone.source.id] = true;
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
    var zones = window.irq.SiS.relativeZones;
    var idx = getZoneIdxById(id, zones);
    clouds[id] = new Cloud(sound, masterContext, zones[idx].cloudParams, zones[idx].grainParams);
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
    var latestSequencedEventTime = 0;

    // times are ms or a function that returns ms
    var defaultCloudParams = {
      interval: 500, // speed factor with which grains are created
      density: 100, // ms grain spacing
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.12, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
      grainCount: 4, // max grain polyphony for this cloud
      startGrainWindow: 0.0, // start of area in sound usable for grain positions
      endGrainWindow: 1.0, // end of area in sound usable for grain positions
    };
    // times are in seconds
    var defaultGrainParams = {
      attack:  0.5,
      release: 0.5,
      pan: 0.0,
      trans: 1.0
    };

    cloudParams = _.extend(defaultCloudParams, cloudParams);
    grainParams = _.extend(defaultGrainParams, grainParams);

    // TODO: check for functions in params that can be dynamic or static
    function grainPosition(buffer) {
      // position is based on cloud's grain window
      // var rnd = Math.floor(Math.random() + cloudParams.jitter);
      var positionRatio = irq.SiS.p.map(irq.SiS.orientation.pointing, 0.0, 360.0, 0.01, 0.99);
      var windowRatio = cloudParams.endGrainWindow - cloudParams.startGrainWindow;
      var windowSize = windowRatio * buffer.duration;
      var windowStart = cloudParams.startGrainWindow * buffer.duration;// + rnd;
      return windowStart + (windowSize * positionRatio);
    }

    function grainPan() {
      // grainParams.pan
      return irq.SiS.p.map(irq.SiS.orientation.tiltLR, -120.0, 120.0, -10.0, 10.0);
    }

    function grainTrans() {
      // grainParams.trans
      return irq.SiS.p.map(irq.SiS.orientation.tiltFB, -180.0, 180.0, 0.6, 1.6);
    }

    function grainLength() {
      if(window.irq.SiS.xyPad1.enabled)  {
        return cloudParams.grainLength * irq.SiS.p.map(irq.SiS.p.mouseY, irq.SiS.xyPad1.h, 0.0, 0.1, 1.0);
      }
      return cloudParams.grainLength;
    }

    function cloudDensity() {
      if(window.irq.SiS.xyPad1.enabled) {
        return cloudParams.density * irq.SiS.p.map(irq.SiS.p.mouseX, 0.01, irq.SiS.xyPad1.w, 1.0, 2.0);
      }
      return cloudParams.density;
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
      var timesToSequence = grainTimesToSequence(now_ms, startTime_ms, tickLength, timeout, cloudDensity());
      latestSequencedEventTime = timesToSequence[timesToSequence.length];
      var buffer = sound.playbackResource;
      var position = grainPosition(buffer);
      var pan = grainPan();
      var amp = cloudParams.amp;
      var trans = grainTrans();
      var length = grainLength();
      var attack = grainParams.attack;
      var release = grainParams.release;

      for (var i = 0; i < timesToSequence.length; i++) {
        var rnd = Math.floor(Math.random() + cloudParams.jitter);
        var positionJitter = rnd * cloudDensity();
        var offsetStartSeconds = (timesToSequence[i] + positionJitter) / 1000;
        grain(masterContext, cloudGain, buffer, offsetStartSeconds, position, amp, pan, trans, length, attack, release);
      }
      sprayTimeout = setTimeout(makeGrain, timeout);
    }

    // TODO: github issue #5: schedule offset generation leaves gaps
    // TODO: github issue #6: extra scheduling after next two tick periods scheduled
    function grainTimesToSequence(now, startTime, tickLength, timeout, density) {
      console.log("calculating new grains");
      var timeElapsedSinceStart = now - startTime;
      var timePastLastTick = timeElapsedSinceStart % tickLength; // amount of time past last absolute tick
      var lastTick = now - timePastLastTick;
      var twoTicksAfterNow = lastTick + (tickLength * 2);
      var firstTick = latestSequencedEventTime === 0;
      var previousToPreSequenceThreshold = (now < twoTicksAfterNow/2);
      if(!firstTick && previousToPreSequenceThreshold) return []; // current and the next tick of time have been filled
      // we should have one tick of time to fill, unless some unforseen skip..
      var offsetTime = density;
      var timesToSequence = [];
      for(var i=0; i<tickLength/offsetTime; i++) {
        timesToSequence.push(lastTick + tickLength + (offsetTime * i));
      }
      return timesToSequence;
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

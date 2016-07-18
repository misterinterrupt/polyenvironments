window.irq = window.irq || {};

(function(exports) {

  // the grain class
  function grain(context, cloudGain, buffer, positionx, positiony, attack, release, spread, pan, trans) {
    this.context = context;
    this.now = context.currentTime; // update the time value
    this.source = context.createBufferSource();
    this.source.playbackRate.value = this.source.playbackRate.value * trans;
    this.source.buffer = buffer;
    // create the gain for enveloping
    this.envelopeGain = context.createGain();
    // TODO:: decide on any further use of panning
    if(parseInt(irq.p.random(3),10) === 1) {
      this.panner = context.createPanner();
      this.panner.panningModel = "equalpower";
      this.panner.distanceModel = "linear";
      this.panner.setPosition(irq.p.random(pan * -1,pan),0,0);
      //connections
      this.source.connect(this.panner);
      this.panner.connect(this.envelopeGain);
    }else{
      this.source.connect(this.envelopeGain);
    }
    this.envelopeGain.connect(cloudGain);

    // TODO:: replace mouse position with orientation params
    //update the position and calcuate the offset
    this.offset = 0.05 + positionx * (buffer.duration / irq.w); //pixels to seconds
    console.log('grain offset:', this.offset);
    // update and calculate the amplitude
    // this.amp = this.positiony / h;
    // this.amp = irq.p.map(this.amp,0.0,1.0,1.0,0.0) * 0.7;
    this.amp = 1.0;

    //parameters
    this.attack = attack * 0.4;
    this.release = release * 1.5;

    if(this.release < 0){
      this.release = 0.1; // 0 - release causes mute for some reason
    }

    var verticalRatio = positiony / irq.h;
    // console.log('verticalRatio', verticalRatio);
    this.spread = verticalRatio * spread;
    // console.log('spread', this.spread);

    this.randomoffset = (Math.random() * this.spread) - (this.spread / 2); //in seconds
    ///envelope
    this.source.start(this.now, this.offset + this.randomoffset, this.attack + this.release); //parameters (when,offset,duration)
    this.envelopeGain.gain.setValueAtTime(0.0, this.now);
    this.envelopeGain.gain.linearRampToValueAtTime(this.amp, this.now + this.attack);
    this.envelopeGain.gain.linearRampToValueAtTime(0, this.now + (this.attack +  this.release) );

    //garbagio collectionism
    this.source.stop(this.now + this.attack + this.release + 0.1);
    var tms = (this.attack + this.release) * 1000 * this.offset; //calculate the time in miliseconds
    console.log('ttl', tms);
    var grain = this;
    setTimeout(function() {
      grain.envelopeGain.disconnect();
      if(this.panner) {
        this.panner.disconnect();
      }
    },tms + 200);

    // //drawing the lines
    // p.stroke(p.random(125) + 125,p.random(250),p.random(250)); //,(this.amp + 0.8) * 255
    // //p.strokeWeight(this.amp * 5);
    // this.randomoffsetinpixels = this.randomoffset / (buffer.duration / w);
    // //p.background();
    // p.line(this.positionx + this.randomoffsetinpixels,0,this.positionx + this.randomoffsetinpixels,p.height);
    // setTimeout(function(){
    //   p.background();
    //   p.line(that.positionx + that.randomoffsetinpixels,0,that.positionx + that.randomoffsetinpixels,p.height);
    // },200);

  }

  // the cloud function
  function cloud(sound, masterContext, config) {
    // master gain node
    var cloudGain = masterContext.createGain();
    cloudGain.connect(masterContext.destination);
    cloudGain.gain.setValueAtTime(1.0, masterContext.currentTime);
    // grains array
    var graincount = 0;
    var grains = [];
    var timeout;

    config = config || {};
    // onset
    config.attack = 0.10;
    // falloff
    config.release = 0.40;
    // speed factor with which grains are created
    config.density = 0.10;
    // dry/wet amount of reverb
    config.reverb = 1.0;
    config.spread = 0.8;
    config.pan = 0.1;
    config.trans = 1.0;

    // create grains
    function makeGrain() {
      var buffer = sound.playbackResource;
      var g = new grain(masterContext, cloudGain, buffer,
        irq.p.mouseX, irq.p.mouseY,
        config.attack, config.release, config.spread, config.pan, config.trans);

      // keep the cloud's grains in an array
      grains[graincount] = g;
      graincount += 1;

      if(graincount > 20) {
        graincount = 0;
      }

      // next interval will be
      config.interval = ((config.density + config.offset) * buffer.duration) + 33;
      timeout = setTimeout(makeGrain.bind(cloud.makeGrain), config.interval);
    }

    function startGrains() {
      makeGrain();
    }

    function stopGrains() {
      clearTimeout(timeout);
    }

    return {
      startGrains: startGrains,
      stopGrains: stopGrains
    };
  }

  // App code
  var displayMessage = null;
  var masterContext = null;
  var loadProxy = null;
  var audioPath = "audio/";
  var soundInstance = null;
  var sources = [
    {id:"FLAPPY", src:"flappy.ogg"},
    {id:"PIGS6", src:"PIGS6.ogg"},
    {id:"TICKLES", src:"TICKLES.ogg"}
  ];
  var clouds = [];
  var sounds = [];
  var config;

  function start() {
    displayMessage = document.getElementById("status");
    if (!createjs.Sound.initializeDefaultPlugins()) {
      document.getElementById("error").style.display = "block";
      document.getElementById("content").style.display = "none";
      return;
    }
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
    if(event.id ==="FLAPPY") {
      var sound = createjs.Sound.createInstance(event.id);
      $(displayMessage).append("<p>Created a sound using the file: " + event.id + "</p>");
      createCloud(sound);
    }
  }

  // make a grain cloud
  function createCloud(sound) {
    clouds[sound.id] = new cloud(sound, masterContext, config);
    clouds[sound.id].startGrains();
  }

  exports.SiS = {
    start: start
  };
}(window.irq));

$( document ).ready(function() {

  // kick off the cloud process
  function initSound(p) {
    irq.p = p;
    var display;
    display = $("#status");
    function handleClick(event) {
      display.off("click");
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
      console.log('processing? ', p);
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

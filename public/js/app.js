var display;

function init() {
  display = $("#status");
  display.on("click", handleClick);
}

function handleClick(event) {
  display.off("click", handleClick);
  var myApp = new myNameSpace.MyApp();
}

this.myNameSpace = this.myNameSpace || {};

(function() {

  // the grain class
  function grain(context, cloudGain, buffer, positionx, positiony, attack, release, spread, pan, trans) {

    this.context = context;
  	this.now = context.currentTime; // update the time value
  	// TODO:: get the source from sound via id, do we need buffer?
  	this.source = context.createBufferSource();
  	this.source.playbackRate.value = this.source.playbackRate.value * trans;
  	this.source.buffer = buffer;
  	// create the gain for enveloping
  	this.envelopeGain = context.createGain();

    // TODO:: decide on use of panning
  	//experimenting with adding a panner node - not all the grains will be panned for better performance
  	// var yes = parseInt(p.random(3),10);
  	// if( yes === 1){
  	// 	this.panner = context.createPanner();
  	// 	this.panner.panningModel = "equalpower";
  	// 	this.panner.distanceModel = "linear";
  	// 	this.panner.setPosition(p.random(pan * -1,pan),0,0);
  	// 	//connections
  	// 	this.source.connect(this.panner);
  	// 	this.panner.connect(this.gain);
  	// }else{
  		this.source.connect(this.envelopeGain);
  	// }


  	this.envelopeGain.connect(cloudGain);

    // TODO:: replace mouse position with orientation params
  	//update the position and calcuate the offset
  	this.positionx = positionx;
  	// this.offset = this.positionx * (buffer.duration / w); //pixels to seconds

    // update and calculate the amplitude
  	// this.positiony = positiony;
  	// this.amp = this.positiony / h;
  	// this.amp = p.map(this.amp,0.0,1.0,1.0,0.0) * 0.7;
    this.amp = 1.0;

  	//parameters
  	this.attack = attack * 0.4;
  	this.release = release * 1.5;

  	if(this.release < 0){
  		this.release = 0.1; // 0 - release causes mute for some reason
  	}
  	this.spread = spread;

  	this.randomoffset = (Math.random() * this.spread) - (this.spread / 2); //in seconds
  	///envelope
  	this.source.start(this.now, 1.0 + this.randomoffset, this.attack + this.release); //parameters (when,offset,duration)
  	this.envelopeGain.gain.setValueAtTime(0.0, this.now);
  	this.envelopeGain.gain.linearRampToValueAtTime(this.amp,this.now + this.attack);
  	this.envelopeGain.gain.linearRampToValueAtTime(0,this.now + (this.attack +  this.release) );

  	//garbagio collectionism
  	this.source.stop(this.now + this.attack + this.release + 0.1);
  	var tms = (this.attack + this.release) * 1000; //calculate the time in miliseconds
    var grain = this;
  	setTimeout(function(){
  		grain.envelopeGain.disconnect();
  		// if(yes === 1){
  		// 	that.panner.disconnect();
  		// }
  	},tms + 200);

  	// //drawing the lines
  	// p.stroke(p.random(125) + 125,p.random(250),p.random(250)); //,(this.amp + 0.8) * 255
  	// //p.strokeWeight(this.amp * 5);
  	// this.randomoffsetinpixels = this.randomoffset / (buffer.duration / w);
  	// //p.background();
  	// p.line(this.positionx + this.randomoffsetinpixels,0,this.positionx + this.randomoffsetinpixels,p.height);
  	// setTimeout(function(){
  	// 	p.background();
  	// 	p.line(that.positionx + that.randomoffsetinpixels,0,that.positionx + that.randomoffsetinpixels,p.height);
  	// },200);

  }


  function MyApp() {
    this.init();
  }

  MyApp.prototype = {

    displayMessage:null,
    loadProxy: null,
    soundInstance: null,
    sources: [
        {id:"FLAPPY", src:"flappy.ogg"},
        {id:"PIGS6", src:"PIGS6.ogg"},
        {id:"TICKLES", src:"TICKLES.ogg"}
    ],
    audioPath :"audio/",
    sounds: [],
    context: null,
    cloud: null,


    init: function() {
      this.displayMessage = document.getElementById("status");

      if (!createjs.Sound.initializeDefaultPlugins()) {
        document.getElementById("error").style.display = "block";
        document.getElementById("content").style.display = "none";
        return;
      }


      $(this.displayMessage).append("<p>loading audio</p>");
      createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
      createjs.Sound.alternateExtensions = ["mp3"];
      this.loadProxy = createjs.proxy(this.handleLoad, this);
      createjs.Sound.addEventListener("fileload", this.loadProxy);
      this.sounds = createjs.Sound.registerSounds(this.sources, this.audioPath);
      console.log(this.sounds);
      this.masterContext = createjs.Sound.activePlugin.context;
    },

    handleLoad: function(event) {
      if(event.id ==="FLAPPY") {
        var sound = createjs.Sound.createInstance(event.id);
        $(this.displayMessage).append("<p>Created a sound using the file: " + event.id + "</p>");
        this.createCloud(sound);
      }
    },

    // make a grain cloud
    createCloud: function(sound) {
      this.cloud = {};
      //master gain node
      this.cloud.gain = this.masterContext.createGain();
      this.cloud.gain.connect(this.masterContext.destination);
      this.cloud.gain.gain.setValueAtTime(1.0, this.masterContext.currentTime);
      // onset
      this.cloud.attack = 0.40;
      // falloff
      this.cloud.release = 0.40;
      // speed factor with which grains are created
      this.cloud.density = 0.85;
      // dry/wet amount of reverb
      this.cloud.reverb = 0.5;
      this.cloud.jitter = 0.3;
      this.cloud.pan = 0.1;
      // this.cloud.trans = 1;
      // store each generated grain here
      this.cloud.grains = [];

      this.cloud.graincount = 0;
      var app = this;
      var cloud = app.cloud;

      // create new grain
      makeGrain = function() {
        var buffer = sound.playbackResource;
        // TODO:: change signature to not include processing()?)
        var g = new grain(app.masterContext, cloud.gain, buffer, 1.0, 1.0, cloud.attack, cloud.release, cloud.jitter, cloud.pan, 1.0);
        // keep the cloud's grains in an array
        cloud.grains[cloud.graincount] = g;
        cloud.graincount+=1;

        if(cloud.graincount > 20) {
          cloud.graincount = 0;
        }
        // next interval will be between 70ms and 1000ms
        cloud.interval = (cloud.density * 1000) + 70;
        cloud.timeout = setTimeout(makeGrain, cloud.interval);
      };
      makeGrain();
    }
  };

  myNameSpace.MyApp = MyApp;
}());

$( document ).ready(init);

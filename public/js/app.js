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
  function MyApp() {
    this.init();
  }

  MyApp.prototype = {
  displayMessage:null,

  init: function() {
    this.displayMessage = document.getElementById("status");

    if (!createjs.Sound.initializeDefaultPlugins()) {return;}

    var audioPath = "audio/";
    var sounds = [
        {id:"FLAPPY", src:"flappy.ogg"},
        {id:"PIGS6", src:"PIGS6.ogg"},
        {id:"TICKLES", src:"TICKLES.ogg"}
    ];

    $(this.displayMessage).append("<p>loading audio</p>");
    createjs.Sound.alternateExtensions = ["mp3"];
    var loadProxy = createjs.proxy(this.handleLoad, this);
    createjs.Sound.addEventListener("fileload", loadProxy);
      sounds.forEach(function(sound) {
        createjs.Sound.registerSound(sound, audioPath);
      });
  },

  handleLoad: function(event) {
    createjs.Sound.play(event.src);
    $(this.displayMessage).append("<p>Playing " + event.src + "</p>");
  }
};

  myNameSpace.MyApp = MyApp;
}());

$( document ).ready(init);

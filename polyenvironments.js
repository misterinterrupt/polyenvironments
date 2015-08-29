if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('all-comps', function() {
    return Comps.find({ owner: this.userId });
  });

  Meteor.publish('all-images', function() {
    return Images.find(
      { owner: this.userId }, 
      { sort: {uploadedAt: -1}});
  });
  
  Meteor.methods({
    addComp: function(imageId) {
      // Make sure the user is logged in before inserting a task
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      Comps.insert({
        image: imageId,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
    },
    makeMusic: function(data) {

      var music = []; // there, we've made music
      // for 1st octave features,
      //    x ascends and wraps the notes via spatialX
      //    y ascends and wraps note lengths via spatialY

      // major: W-W-H-W-W-W-H
      // minor: W-H-W-W-H-W-W
      // harmonicMinor 7^
      // melodicMinor 6^ 7^

      var majorDegrees = [0,2,4,5,7,9,11];
      var minorDegrees = [0,2,3,5,7,8,10];
      var harmonicMinDegrees = [0,2,3,5,7,9,10];
      var melodicMinDegrees = [0,2,3,5,8,9,10];

      var scales = [majorDegrees, minorDegrees, harmonicMinDegrees, melodicMinDegrees];
      var notes = ['c', 'c+', 'd', 'd+', 'e', 'f', 'f+', 'g', 'g+', 'a', 'a+', 'b'];
      // the total number of features in 2nd octave modulo length of scales decides which scale
      var scale = data[1].length % scales.length;
      var key = data[2].length % notes.length;
      // // add offset to note indexing to
      // for (var n = 0; n < key; n++) {
      //   var front = notes.shift();
      //   notes.push(front);
      // };

      console.log('scale', scales[scale]);
      // console.log('key', notes[key]);

      // the chords are indexes into the degrees
      var chords = [
        [0, 1, 4], [0, 1, 5], [0, 1, 6],
        [0, 2, 6], [0, 2, 5], [0, 2, 4],
        [0, 3, 6], [0, 3, 5], [0, 3, 4]
      ];


      function map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      }
      function map_percent(value, min, max) {
        return (value - min) / (max - min);
      }

      for (var octIdx = 0; octIdx < data.length; octIdx++) {
        
        //var octave = _.uniq(data[octIdx]);
        var octave = data[octIdx];
        // var minX, minY, maxX, maxY = 0;
        console.log('num features in octave ' + octIdx, octave.length);
        if(octave.length > 0) {
          minX = _.min(octave, function(pair) {
            return pair[0];
          });
          minY = _.min(octave, function(pair) {
            return pair[1];
          });
          maxX = _.max(octave, function(pair) {
            return pair[0];
          });
          maxY = _.max(octave, function(pair) {
            return pair[1];
          });

          console.log('minX, minY, maxX, maxY', minX[0], maxX[0], minY[1], maxY[1]);
          var rangeX = maxX[0] - minX[0];
          var rangeY = maxY[1] - minY[1];
          console.log('rangeX, rangeY', rangeX, rangeY);
          

          // quantize x values 
          var skip = 10;
          var quantizedOctave = _.filter(octave, function(num, i) {
            return i%skip==0?num:false;
          });
          console.log('skip', skip);
          console.log('quantized length', quantizedOctave.length);

          // get spatial freq of x
          //  - sort by y for x and sort by x for y
          //  - plot distance as percent
          var sortedOctave = _.sortBy(quantizedOctave, function(pair) {
            return pair[1];
          });
          console.log(sortedOctave);
          var maxDistX = 100;
          var spatialX = _.map(sortedOctave, function(num, i, list) {
            var distance = 1;
            if(i===0) {
              distance = 0;
            } else {
              distance = Math.abs((num[0] - list[i-1][0]) % 9);
              // map range from 0 to maxDist map_range(value, low1, high1, low2, high2)
              // distance = map_range(distance, minX[0], maxX[0], 0, 10);

            }
            return distance;
          });
          // sortedOctave = _.sortBy(quantizedOctave, function(pair) {
          //   return pair[0];
          // });
          var maxNoteY = 60; // more octave space by increasing octave
          var minNoteY = 36;
          var spatialY = _.map(quantizedOctave, function(num, i, list) {
            var distance = 1;
            if(i===0) {
              distance = 0;
            } else {
              distance = (num[1] - list[i-1][1]);
              distance = map_range(distance, minY[1], maxY[1], minNoteY, maxNoteY);
              // distance = (num[1] - list[i-1][1]) % maxNoteY; // wrap for note vals
              //console.log((num[1] - list[i-1][1]) + ' % ' + maxNoteY );
            }
            return distance;
          });
          console.log('X spatial freq', spatialX);
          console.log('Y spatial freq', spatialY);

          var mml = "";

          // write some mml
          for (var i = 0; i < spatialX.length; i++) {
            // rest, rest, rest, chord, chord, note, note, note, note, tie,
            // var modifiers = [' ', 'r ', ' ', '0 ', '0 ', '0 ', '0 ', ' ', ' ', '& ', ' ', ' '];
            var noteLengths = ['r', '0', '&', '1', '1.', '2', '0', 'r', '0', 'r']; 
            var noteBase = quantizedOctave[i][0];
            //console.log('noteBase', noteBase);
            var noteBase = spatialY[i];
            var interval = parseInt(noteBase % 7);
            // intervals go down from 12 in the negative
            if(0 > interval) {
              interval = 7 + interval;
            };

            var note = notes[scales[scale][interval]];
            // var note = notes[scales[0][0]];
            //console.log('scale index: ' + scales[scale][interval] + ' interval: ' + interval);
            // var mod = modifiers[spatialX[i]%noteLengths.length];
            // var mod = modifiers[0];
            var mod = noteLengths[spatialX[i]];
          //console.log('mod index', spatialX[i]%10 -1);
            // add octaves for notes not in the first musical octave of the Y ranges (bipolar)
            var octup= 0;
            var octdn= 0;
            var note = '' + note + '' + (mod=='r'?'':mod);
            if (0 > parseInt(noteBase)) {
              octdn = Math.abs(Math.floor(noteBase / 7));
              console.log('octdn', octdn);
              for (var j = 0; j < octdn; j++) {
                note = '>' + note + '<';
              };
            } else { 
              octup = Math.ceil(noteBase / 7);
              console.log('octup', octup);
              for (var k = 0; k < octup; k++) {
                note = '<' + note + '>';
              };
            }
            note = note + '' + (mod=='r'?mod:'');
            

            mml = mml + ' ' + note;
          }
          console.log("mml ", mml);

          var playable = {
                          mml: '[' + mml + ']',
                          scale: scale,
                          key: key,
                          tempoMod: data[2].length % 25,
                          noiseLevel: spatialX[spatialX.length-1],
                          noiseFrquency: maxY[1]
                        }
          music.push(playable);
        }

      } // end per octave


      return music;
    }
  });
}


Router.configure({
  layoutTemplate: 'polyenvironments'
});


if (Meteor.isClient) {

  currentData = {};

  Meteor.subscribe('all-comps');
  Meteor.subscribe('all-images');

  Router.route('/', function () {
    this.layout('polyenvironments');
    this.render('allComps');
  },{
    name: 'comp.all'
  });

  Template.allComps.helpers({
    comps: function () {
      return Comps.find({sort: {uploadedAt: -1}});
    },
    images: function () {
      var imgs = Images.find();
      return imgs // Where Images is an FS.Collection instance
    }
  });

  Template.allComps.events({
    // events for nav and for play
    'click button': function () {
      // increment the counter when button is clicked
      // Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.compCreate.helpers({

  });

  Template.compCreate.rendered = function() {
    
    var layer1 = document.getElementById('layer1');
    var layer2 = document.getElementById('layer2');
    var context1 = layer1.getContext('2d').globalAlpha = 0.1;
    var context2 = layer2.getContext('2d').globalAlpha = 0.1;
    

    // set scaled dimensions based on the media
    video.addEventListener('playing', function(ev){
      streaming = false;
      width = 320;
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        layer1.setAttribute('width', width);
        layer1.setAttribute('height', height);
        layer2.setAttribute('width', width);
        layer2.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    getCamera();
  }

  Template.compCreate.events({
    'change #upload': function(event, template) {

      FS.Utility.eachFile(event, function(file) {
        Images.insert(file, function (err, fileObj) {

          if(err) { console.log(err); }
          //If !err, we have inserted new doc with ID fileObj._id, and
          //kicked off the data upload using HTTP
        });
      });
    },
    // 'load #imgtag': function(event, template) {

    //   // var canvas = document.getElementById('canvas');
    //   // var image =  document.getElementById('imgtag');
    //   // findAndDrawFeatures(image, canvas);

    // },
    'click #capture': function(event, template) {

      // var canvas = document.getElementById('canvas');
      // var context = canvas.getContext('2d');
      // var v = document.getElementById('video');
      // drawToImage(v,context,canvas); // when save button is clicked, draw video feed to canvas
      var layer1 = document.getElementById('layer1');
      var layer2 = document.getElementById('layer2');
      var image =  document.getElementById('video');
      findAndDrawFeatures(layer1, layer2, image);
    },
    'click #play': function() {
      Meteor.call("makeMusic", currentData, playMusic);
    },
    'click #stop': function() {
      stopMusic();
    },
    'change #fileselect': function(event, template) {

      var layer1 = document.getElementById('layer1');
      var layer2 = document.getElementById('layer2');
      //var imgtag = document.getElementById('imgtag'); // get reference to img tag
      var sel = document.getElementById('fileselect'); // get reference to file select input element
      var f = sel.files[0]; // get selected file (camera capture)
      
      var fr = new FileReader();
      fr.onload = function receivedData() {
        drawDataURIOnCanvas(fr.result, layer1, function() {
          findAndDrawFeatures(layer1, layer2);
        });
        // readAsDataURL is finished - add URI to IMG tag src
        // imgtag.src = fr.result;
      }; // add onload event

      console.log(f);
      fr.readAsDataURL(f); // get captured image as data URI

    }
  });

  Router.route('/comp/create', function () {

    this.layout('polyenvironments');

    this.render('compCreate');
  }, {
    name: 'comp.create'
  });



  Router.route('/comp/:_id', function () {

    this.layout('polyenvironments');

    this.render('comp', {
      data: function () {
        return Comps.findOne({_id: this.params._id});
      }
    });

  },{
    name: 'comp.show'
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
  });
}


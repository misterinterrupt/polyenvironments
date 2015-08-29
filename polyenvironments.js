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

      // the total number of features modulo length of scales decides which scale
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

      // the chords are indexes into the degrees
      var chords = [
        [0, 1, 4], [0, 1, 5], [0, 1, 6],
        [0, 2, 6], [0, 2, 5], [0, 2, 4],
        [0, 3, 6], [0, 3, 5], [0, 3, 4]
      ];


      for (var octIdx = 0; octIdx < data.length; octIdx++) {
        
        var octave = _.uniq(data[octIdx]);
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
          

          // quantize x values to quantths of the range
          var quant = (octave.length / (100 - (octIdx*10)));
          var skip = 5;
          if( quant > 1.0) {
            skip = Math.floor(skip*quant);
          }
          var quantizedOctave = _.filter(octave, function(num, i) {
            return i%skip==0?num:false;
          });
          console.log('skip', skip);
          console.log('quantized length', quantizedOctave.length);

          // get spatial freq of x
          //  - sort by x
          //  - plot distance to last
          var sortedOctave = _.sortBy(quantizedOctave, function(pair) {
            return pair[0];
          });

          var maxNote = 12*(octIdx+1);
          var spatialX = _.map(sortedOctave, function(num, i, list) {
            var distance = 1;
            if(i===0) {
              distance = 0;
            } else {
              distance = (num[0] - list[i-1][0]) % maxNote; // wrap for note vals

              console.log((num[0] - list[i-1][0]) + ' % ' + maxNote );
            }
            return distance;
          });
          var spatialY = _.map(sortedOctave, function(num, i, list) {
            var distance = 1;
            if(i===0) {
              distance = 0;
            } else {
              distance = (num[1] - list[i-1][1]) % maxNote; // wrap for note vals
              console.log((num[1] - list[i-1][1]) + ' % ' + maxNote );
            }
            return distance;
          });
          console.log('X spatial freq', spatialX);
          console.log('Y spatial freq', spatialY);

          var mml = "";

          // write some mml
          for (var i = 0; i < spatialX.length; i++) {
            // rest, rest, rest, chord, chord, note, note, note, note, tie,
            var modifiers = ['r ', 'r ', 'r ', '0 ', '0 ', ' ', ' ', ' ', ' ', '& ', '& ', '0 '];

            var interval = parseInt(spatialY[i] % 12);
            // intervals go down from 12 in the negative
            if(0 > interval) {
              interval = 12 + interval;
            };

            console.log('interval', interval);
            // var note = notes[scales[0][interval]];
            var note = notes[scales[0][0]];
            //console.log(note);
            var mod = modifiers[spatialX[i]%12];
            // var mod = modifiers[0];

            // add octaves for notes not in the first musical octave of the Y ranges (bipolar)
            var octup= 0;
            var octdn= 0;
            if (0 > parseInt(spatialY[i])) {
              octdn = Math.abs(Math.floor(spatialY[i] / 12));
              var nod = note + mod;
              for (var j = 0; j < octdn; j++) {
                note = '>' + nod + '<';
              };
            } 
            else {
              var nod = note + mod; 
              octup = Math.ceil(spatialY[i] / 12);
              for (var k = 0; k < octup; k++) {
                note = '<' + nod + '>';
              };
            }
            

            mml = mml + ' ' + note;
          }
          console.log("mml ", mml);

          var playable = {
                          mml: '[' + mml + ']',
                          scale: "",
                          noteSeq: "",
                          tempo: "",
                          noteValues: "",
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


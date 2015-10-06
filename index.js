var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var defaultPort = process.env.PORT || 80;

app.set('view engine', 'jade');
app.use(express.static('public'));

//parse post vars - from: http://stackoverflow.com/questions/5710358/how-to-get-post-a-query-in-express-js-node-js
app.use( bodyParser.json({
  extended: false,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}) );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.render('./compCreate.jade');
});

app.post('/makeMusic', function(req, res) {
  console.log(req.body.data.length);
  res.send(makeMusic(req.body.data));
});

var server = app.listen(defaultPort, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("polyenvironments listening http://%s:%s", host, port);
});


var makeMusic = function(data) {
  // console.log(data);

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
  for (var n = 0; n < key; n++) {
    var front = notes.shift();
    notes.push(front);
  };

  console.log('scale', scales[scale]);
  console.log('key', notes[key]);

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
    console.log('num features in octave ' + octIdx + ' is ' + octave.length);
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

      // console.log('minX, minY, maxX, maxY', minX[0], maxX[0], minY[1], maxY[1]);
      var rangeX = maxX[0] - minX[0];
      var rangeY = maxY[1] - minY[1];
      // console.log('rangeX, rangeY', rangeX, rangeY);
      

      // quantize x values 
      var skip = 10;
      var quantizedOctave = _.filter(octave, function(num, i) {
        return i%skip==0?num:false;
      });
      console.log('quantize period', skip);
      console.log('quantized octave length', quantizedOctave.length);

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
      sortedOctave = _.sortBy(quantizedOctave, function(pair) {
        return pair[0];
      });
      // var maxNoteY = 60; // more octave space by increasing octave
      // var minNoteY = 36;
      var spatialY = _.map(quantizedOctave, function(num, i, list) {
        var distance = 1;
        if(i===0) {
          distance = 0;
        } else {
          // distance = (num[1] - list[i-1][1]);
          // distance = map_range(distance, minY[1], maxY[1], minNoteY, maxNoteY);
          distance = (num[1] - list[i-1][1]) % 5; // wrap for note vals
          // console.log((num[1] - list[i-1][1]) + ' % ' + maxNoteY );
        }
        return distance;
      });
      // console.log('X spatial freq', spatialX);
      // console.log('Y spatial freq', spatialY);

      var mml = "";

      // write some mml
      for (var i = 0; i < spatialX.length; i++) {
        // rest, rest, rest, chord, chord, note, note, note, note, tie,
        // var modifiers = [' ', 'r ', ' ', '0 ', '0 ', '0 ', '0 ', ' ', ' ', '& ', ' ', ' '];
        var noteLengths = ['r', '0', '&', '1', '1.', '2', '0', 'r', '0', 'r'];
        var noteBase = quantizedOctave[i][0];
        console.log('noteBase', noteBase);
        var noteBase = spatialY[i];
        var interval = Number(noteBase % 7);
        // intervals go down from 12 in the negative
        if(0 > interval) {
          interval = 7 + interval;
        };

        var note = notes[scales[scale][interval]];
        // var note = notes[scales[0][0]];
        console.log('scale index: ' + scales[scale][interval] + ' interval: ' + interval);
        // var mod = modifiers[spatialX[i]%noteLengths.length];
        // var mod = modifiers[0];
        var mod = noteLengths[spatialX[i]];
        // console.log('mod index', spatialX[i]%10 -1);
        // add octaves for notes not in the first musical octave of the Y ranges (bipolar)
        var octup= 0;
        var octdn= 0;
        var note = '' + note + '' + (mod=='r'?'':mod);

        console.log("Number(noteBase)", Number(noteBase), 10);

        if (0 > Number(noteBase)) {
          octdn = map_percent(noteBase, minY[1], maxY[1]) * 100;
          // octdn = Math.abs(Math.floor(noteBase / 7));
          console.log('octdn', octdn);
          for (var j = 0; j < octdn; j++) {
            note = '>' + note + '<';
          };
        } else { 
          octup = map_percent(noteBase, minY[1], maxY[1]) * 100;
          // octup = Math.ceil(noteBase / 7);
          console.log('octup', octup);
          for (var k = 0; k < octup; k++) {
            note = '<' + note + '>';
          };
        }
        note = note + '' + (mod=='r'?mod:'');
        

        mml = mml + ' ' + note;
      }
      // console.log("mml ", mml);

      var playable = {
                      mml: '[' + mml + ']',
                      scale: scale,
                      key: key,
                      tempoMod: data[2].length % 45,
                      noiseLevel: spatialX[spatialX.length-1],
                      noiseFrquency: maxY[1]
                    }
      music.push(playable);
    }

  } // end per octave


  return music;
}
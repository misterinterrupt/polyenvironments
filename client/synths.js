var playingComp1;
var playingComp2;
var playingComp3;
var playingComp4;

stopMusic = function() {
  timbre.pause();
  timbre.reset();
}

playMusic = function(err, music) {
  timbre.pause();
  timbre.reset();

  playingComp1 = pluckComp1(music[1]).start();
  playingComp2 = pluckComp2(music[2]).start();
  playingComp3 = chordComp(music[0]).start();
  playingComp4 = chimesComp(music[3]).start();
}

// function() {
//   timbre.rec(function(output) {
//     var midis = [69, 71, 72, 76, 69, 71, 72, 76].scramble();
//     var msec  = timbre.timevalue("bpm120 l8");
//     var synth = T("OscGen", {env:T("perc", {r:msec, ar:true})});
//     var gen = T("PluckGen", {env:T("adsr", {r:100})});

//     T("interval", {interval:msec}, function(count) {
//       if (count < midis.length) {
//         synth.noteOn(midis[count], 100);
//         gen.noteOn(midis[count], 100);
//       } else {
//         output.done();
//       }
//     }).start();

//     output.send(synth, gen);
//   }).then(function(result) {
//     var L = T("buffer", {buffer:result, loop:true});
//     var R = T("buffer", {buffer:result, loop:true});

//     var num = 400;
//     var duration = L.duration;

//     R.pitch = (duration * (num - 1)) / (duration * num);

//     T("delay", {time:"bpm120 l16", fb:0.1, cross:true},
//       T("pan", {pos:-0.6}, L), T("pan", {pos:+0.6}, R)
//     ).play();
//   });
// };

// pluckCompExample = function pluckCompExample() {
//   // mmml scheduler
//   var tempo = "t140";
//   var noteLength = "l16";
//   var mml = tempo + " " + noteLength + " [ a0e0g0 r c&b a rrr d r b&a a r g0e2b0 r g0a0b2 rrr ]16";
//   //var gen = T("OscGen", {wave:"pulse", env:{type:"adsr", r:150}, mul:0.25});
//   var gen = T("PluckGen", {env:T("adsr", {r:100})});
//   T("reverb", {room:0.95, damp:0.7, mix:0.85}, gen).play();
//   T("mml", {mml:mml}, gen).on("ended", function() {
//     //gen.pause();
//     //this.start();
//   }).start();
// };

pluckComp1 = function pluckComp1(data) {
  // mmml scheduler
  var that = this;
  var tempo = 114  + data.tempoMod * 2;
  var noteLength = "l16 ";
  //var mml = noteLength + " [ a2. e2. g2. r c&b a rrr d r b&a a r g0e2b0 r g0a0b2 rrr ]16";
  var mml = 't' + tempo + ' '+ noteLength + data.mml + '4';
  // var gen = T("OscGen", {wave:"pulse", env:{type:"adsr", r:150}, mul:0.25});
  var gen = T("PluckGen", {env:T("adsr", {r:100}), mul:0.9});
  T("reverb", {room:0.99, damp:0.35, mix:0.75}, gen).play();
  return T("mml", {mml:mml}, gen).on("ended", function() {
    gen.pause();
    that.stop();
  });
};

pluckComp2 = function pluckComp2(data) {
  // mmml scheduler
  var that = this;
  var tempo = 114 + data.tempoMod;
  var noteLength = "l64 ";
  //var mml = noteLength + " [ a2. e2. g2. r c&b a rrr d r b&a a r g0e2b0 r g0a0b2 rrr ]16";
  var mml = 't' + tempo + ' ' + noteLength + data.mml + '4';

  var msec = timbre.timevalue("BPM" + tempo + " L4.");
  var gen = T("OscGen", {wave:"saw", env:{type:"adsr", r:80}});
  //var gen = T("PluckGen", {env:T("adsr", {r:100})});
  T("bandpass" , {cutoff:2020, Q:50}, gen);
  T("delay" , {time:msec, fb:0.35, mix:0.5}, gen).play();
  return T("mml", {mml:mml}, gen).on("ended", function() {
    gen.pause();
    that.stop();
  });
};

chordComp = function chordComp(data) {

  var that = this;
  var tempo = 114 + data.tempoMod;
  var noteLength = "l8 ";
  var mml = 't' + tempo + ' ' + noteLength + data.mml + '6';

  var msec = timbre.timevalue("BPM" + tempo + " L8.");
  var osc  = T("saw");
  var env  = T("env", {table:[0.2, [1, msec * 24], [0.2, msec * 12]]});
  var gen  = T("OscGen", {osc:osc, env:env, mul:0.5});

  var pan   = T("pan", gen);
  var synth = pan;

  var t = T("+sin", {freq:0.36, add:100, mul:25});
  var tp = T("pulse", {freq:0.01*data.tempoMod, mul:.04});
  var freq = T("sin", {freq:5, add:2400, mul:800}).kr();

  synth = T("+saw", {freq:(msec * 2)+"ms", add:0.7, mul:0.95}, synth);
  // synth = T("phaser", {freq:freq, Q:0.7, steps:2, mul:0.2}, synth);
  synth = T("hpf" , {cutoff:1420*tp, Q:36}, synth);
  synth = T("delay" , {time:msec, fb:0.6, mix:0.5}, synth);
  synth = T("reverb", {room:0.95, damp:0.4, mix:0.85}, synth).play();
  pan.pos.value = tp * 2 - 1;
  return T("mml", {mml:mml}, gen).on("ended", function() {
    gen.pause();
    that.stop();
  });
};

chimesComp = function chimesComp(data) {
  // mmml scheduler
  var that = this;
  var tempo = 114 + data.tempoMod * 2;
  var noteLength = "l16 ";
  //var mml = noteLength + " [ a2. e2. g2. r c&b a rrr d r b&a a r g0e2b0 r g0a0b2 rrr ]16";
  var mml = 't' + tempo + ' ' + noteLength + data.mml + '2';

  var msec = timbre.timevalue("BPM" + tempo + " L16.");
  var xline = T("param", {value:1}).expTo(1000, "9sec");
  var freq  = T("sin", {freq:xline, mul:200, add:800});
  var gen = T("OscGen", {wave:"tri", freq:freq, env:{type:"adsr", r:80}, mul:0.7});
  //var gen = T("PluckGen", {env:T("adsr", {r:100})});
  // gen = T("delay" , {time:msec, fb:0.4, mix:0.4}, gen);
  T("reverb", {room:0.95, damp:0.3, mix:0.55}, gen).play();

  return T("mml", {mml:mml}, gen).on("ended", function() {
    gen.pause();
    that.stop();
  });
};

// (function() {
//   // dict example

//   var dict = {0:2640, 1:880, 2:1760, 3:660};
//   dict = T("ndict", {dict:dict});

//   T("tri", {freq:dict, mul:0.25}).play();

//   T("interval", {interval:250}, function(count) {
//     dict.index = count % 4;
//   }).start();
// })();

// (function() {
//   // chordwork
//   var pattern = new sc.Pshuf(sc.series(12), Infinity);
//   var scale   = new sc.Scale.major();
//   var chords  = [
//     [0, 1, 4], [0, 1, 5], [0, 1, 6],
//     [0, 2, 6], [0, 2, 5], [0, 2, 4],
//     [0, 3, 6], [0, 3, 5], [0, 3, 4]
//   ];

//   var msec = timbre.timevalue("BPM120 L16");
//   var osc  = T("saw");
//   var env  = T("env", {table:[0.2, [1, msec * 48], [0.2, msec * 16]]});
//   var gen  = T("OscGen", {osc:osc, env:env, mul:0.5});

//   var pan   = T("pan", gen);
//   var synth = pan;

//   synth = T("+saw", {freq:(msec * 2)+"ms", add:0.3, mul:0.95}, synth);
//   synth = T("lpf" , {cutoff:1200, Q:12}, synth);
//   synth = T("reverb", {room:0.95, damp:0.1, mix:0.75}, synth);

//   T("interval", {interval:msec * 64}, function() {
//     var root = pattern.next();
//     chords.choose().forEach(function(i) {
//       gen.noteOn(scale.wrapAt(root + i) +60, 80);
//     });
//     pan.pos.value = Math.random() * 2 - 1;
//   }).set({buddies:synth}).start();
// })();
var playingComp1;
var playingComp2;

stopMusic = function() {
  timbre.reset();
}

playMusic = function(err, music) {

  timbre.reset();

  playingComp1 = pluckComp1(music[2]).start();
  playingComp2 = pluckComp2(music[2]).start();

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

pluckCompExample = function pluckCompExample() {
  // mmml scheduler
  var tempo = "t140";
  var noteLength = "l16";
  var mml = tempo + " " + noteLength + " [ a0e0g0 r c&b a rrr d r b&a a r g0e2b0 r g0a0b2 rrr ]16";
  //var gen = T("OscGen", {wave:"pulse", env:{type:"adsr", r:150}, mul:0.25});
  var gen = T("PluckGen", {env:T("adsr", {r:100})});
  T("reverb", {room:0.95, damp:0.7, mix:0.85}, gen).play();
  T("mml", {mml:mml}, gen).on("ended", function() {
    //gen.pause();
    //this.start();
  }).start();
};

pluckComp1 = function pluckComp1(data) {
  // mmml scheduler
  var that = this;
  var tempo = "t114 ";
  var noteLength = "l16 ";
  //var mml = noteLength + " [ a2. e2. g2. r c&b a rrr d r b&a a r g0e2b0 r g0a0b2 rrr ]16";
  var mml = tempo + noteLength + data.mml + '2';
  // var gen = T("OscGen", {wave:"pulse", env:{type:"adsr", r:150}, mul:0.25});
  var gen = T("PluckGen", {env:T("adsr", {r:100})});
  T("reverb", {room:0.95, damp:0.7, mix:0.85}, gen).play();
  return T("mml", {mml:mml}, gen).on("ended", function() {
    gen.pause();
    that.stop();
  });
};

pluckComp2 = function pluckComp2(data) {
  // mmml scheduler
  var that = this;
  var tempo = 114 + data.tempoMod;
  var noteLength = "l16 ";
  //var mml = noteLength + " [ a2. e2. g2. r c&b a rrr d r b&a a r g0e2b0 r g0a0b2 rrr ]16";
  var mml = 't' + tempo + ' ' + noteLength + data.mml + '2';
  var gen = T("OscGen", {wave:"tri", env:{type:"adsr", r:80}, mul:0.25});
  //var gen = T("PluckGen", {env:T("adsr", {r:100})});
  T("reverb", {room:0.95, damp:0.7, mix:0.65}, gen).play();
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
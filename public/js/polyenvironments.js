Template.compCreate.rendered = function() {
  
  $('#layer1').hide();
  var layer1 = document.getElementById('layer1');
  var layer2 = document.getElementById('layer2');
  var context1 = layer1.getContext('2d').globalAlpha = 0.1;
  var context2 = layer2.getContext('2d').globalAlpha = 0.1;
  

  // set scaled dimensions based on the media
  video.addEventListener('playing', function(ev){
    streaming = false;
    width = 500;
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
  // 'change #upload': function(event, template) {

  //   FS.Utility.eachFile(event, function(file) {
  //     Images.insert(file, function (err, fileObj) {

  //       if(err) { console.log(err); }
  //       //If !err, we have inserted new doc with ID fileObj._id, and
  //       //kicked off the data upload using HTTP
  //     });
  //   });
  // },
  // 'load #imgtag': function(event, template) {

  //   // var canvas = document.getElementById('canvas');
  //   // var image =  document.getElementById('imgtag');
  //   // findAndDrawFeatures(image, canvas);

  // },
  'click #capture': function(event, template) {
    $('#layer1').show();
    $('#video').hide();
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
    $('#layer1').show();
    $('#video').hide();
    Meteor.call("makeMusic", currentData, playMusic);
  },
  'click #stop': function() {
    stopMusic();
    $('#video').show();
    $('#layer1').hide();
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

    // console.log(f);
    fr.readAsDataURL(f); // get captured image as data URI
    $('#layer1').show();
    $('#video').hide();
  }
});
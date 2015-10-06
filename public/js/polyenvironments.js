var compCreateRender = function() {
  
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

var setupEvents = function() {
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
  $('#capture').on('click', function(event, template) {
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
  });

  $('#play').on('click', function() {
    $('#layer1').show();
    $('#video').hide();
    // var dat = JSON.stringify([{ 'data': currentData }]);
    // var dat = [{ 'data': currentData}];
    // var dat = JSON.stringify(currentData);
    var dat = { 'data': currentData };
    $.ajax({
          url: '/makeMusic/',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          success: playMusic,
          data: JSON.stringify(dat)
        });
  });

  $('#stop').on('click', function() {
    stopMusic();
    $('#video').show();
    $('#layer1').hide();
  });

  $('#fileselect').on('change', function(event, template) {

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
  });
};

$(function(){
  compCreateRender();
  setupEvents();
});
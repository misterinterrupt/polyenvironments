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


}


Router.configure({
  layoutTemplate: 'polyenvironments'
});


if (Meteor.isClient) {

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
    // var context = canvas.getContext('2d');
    // no longer doing it in realtime
    // trackImage(context, function(){});

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
    pluckComp1();
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
    'click #save': function(event, template) {

      // var canvas = document.getElementById('canvas');
      // var context = canvas.getContext('2d');
      // var v = document.getElementById('video');
      // drawToImage(v,context,canvas); // when save button is clicked, draw video feed to canvas
      var layer1 = document.getElementById('layer1');
      var layer2 = document.getElementById('layer2');
      var image =  document.getElementById('video');
      findAndDrawFeatures(layer1, layer2, image);
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
  }
})

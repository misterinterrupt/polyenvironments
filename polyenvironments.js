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
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

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

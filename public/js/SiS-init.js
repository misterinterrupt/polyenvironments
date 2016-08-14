window.irq = window.irq || {};
window.irq.SiS = window.irq.SiS || {};
window.irq.SiS.xyPad1 = {
  enabled: false
};

$(document).ready(function() {

  // kick off the cloud process
  function initApp(p) {
    // shoving specifics about the sketch into global
    // define the processing context
    p.setup = function() {
      if(window.irq.SiS.xyPad1.enabled) {
        window.irq.SiS.xyPad1.w = parseInt($('#control-pad-1').css('width'),10);
        window.irq.SiS.xyPad1.h = parseInt($('#control-pad-1').css('height'),10);
        p.size(window.irq.SiS.xyPad1.w, window.irq.SiS.xyPad1.h);
        var teal = p.color(0, 191, 255);
        var pink = p.color(255, 0, 238);
        var darkerPink = p.color(255, 0, 187);
        p.background(teal);
        p.frameRate(24);
        p.noLoop();
        //change the size on resize
        $(window).resize(function() {
          window.irq.SiS.xyPad1.w = parseInt($('#control-pad-1').css('width'),10);
          window.irq.SiS.xyPad1.h = parseInt($('#control-pad-1').css('height'),10);
          p.size(window.irq.SiS.xyPad1.w, window.irq.SiS.xyPad1.h);
        });
        // make the x/y pad not look like a broken video
        var divisions = 17;
        var size = 25;
        var divX = window.irq.SiS.xyPad1.w / divisions;
        var divY = window.irq.SiS.xyPad1.h / divisions;
        var xOffset = divX/2;
        var yOffset = divY/2;
        p.stroke(pink);
        p.fill(darkerPink);
        for(var k=0; k<divisions; k++) {
          // p.stroke(strokeStart);
          for(var i = 0; i<divisions;i++) {
            var cX = divX*i+xOffset;
            var cY = divY*k+yOffset;
            var circumRadius = size/2;
            var p1Y = cY + circumRadius;
            var p2X = cX - circumRadius;
            var p2Y = cY - circumRadius;
            var p3X = cY + circumRadius;
            var p3Y = cY - circumRadius;
            p.triangle(cX, p1Y, p2X, p2Y, p3X, p3Y);
          }
        }
      }
    };
    // put processing on the global NS
    window.irq.SiS.p = p;
    window.irq.SiS.areaIsActive = false;
    var $display, $instructions, $title, $nextBtn;
    $display = $("#status");
    $nextBtn = $('#next').on("click", function(){
      window.irq.SiS.areaIsActive = !window.irq.SiS.areaIsActive;
      console.log(window.irq.SiS.areaIsActive);
    });

    // $instructions = $("#instructions");

    function handleClick(event) {
      // $instructions.hide();
      $display.off("click");
      // HEY: start the app here
      window.irq.SiS.start();
    }
    $display.on("click", handleClick);
  }

  // set up processing first
  // it is essentially the app UI
  var xyPad = document.getElementById('control-pad-1');
  if(!window.irq.SiS.xyPad1.enabled) {
    $(xyPad).hide();
  }
  var processing = new Processing(xyPad, initApp);

  // set up gps origin  // geolib seems to conventionally key it as lon/lat google locations are lat/lon
  // window.irq.SiS.zoneOrigin = { latitude:37.7709419, longitude: -122.4695236} ; // de young museum cafe area
  window.irq.SiS.currentPosition = {
    "latitude": "37.770186961429175",
    "longitude":"-122.46781960133366"
  }; // default is somewhere in the cafe area


  window.irq.SiS.inhabitedAreas = [];
  // main function that tracks location in the areas
  window.irq.SiS.updateInhabitedAreas = function(changeSound, cb) {
    if(changeSound) {
      window.irq.SiS.inhabitedAreas = []; // clear out old ones
        var rndm = Math.floor(Math.random() * irq.SiS.relativeZones.length-1);
        var zone = irq.SiS.relativeZones[rndm];
        window.irq.SiS.inhabitedAreas[0] = zone;
      // removed until https on domain
      // window.irq.SiS.getCurrentPosition(function(position) {
      //   var nativepos = position;
      //   // leave the last or default position if there is none
      //   currentPosition = position || window.irq.SiS.currentPosition;
      //
      //   window.irq.SiS.areas.forEach(function(area) {
      //     var concourse5 = {"latitude":"37.77043598858816", "longitude": "-122.46708772142483"};
      //     var concourse9 = {"latitude": "37.770186961429175","longitude":"-122.46781960133366"};
      //     var cafegrass1 = { "latitude":37.7709419, "longitude": -122.4695236};
      //     currentPosition = {"lat":nativepos.coords.latitude, "lon": nativepos.coords.longitude};
      //     var inside = geolib.isPointInside(cafegrass1, area.points);
      //     if(inside) {
      //       window.irq.SiS.inhabitedAreas[area.name] = true;
      //       console.log(area.name);
      //     }
      //   }); // end areas forEach
      //   cb();
      //
      // }); // end getCurrentPosition cb
    }
    cb();
  }; // end updateInhabitedAreas

  // returns current position
  window.irq.SiS.getCurrentPosition = function(cb) {
    navigator.geolocation.getCurrentPosition(cb,cb,{enableHighAccuracy: true});
  };

  window.irq.SiS.setOrigin = function(lat, lon) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
          var geoArr = [position.coords.longitude, position.coords.latitude, position.coords.altitude];
          console.log('You are ' + geolib.getDistance(geoArr, {
              latitude: 51.525,
              longitude: 7.4575
          }) + ' meters away from 51.525, 7.4575');
      },
      function() {
          console.log('Position could not be determined.');
      },
      {
          enableHighAccuracy: true
      }
    );
  }; // end setOrigin
}); // end $.ready()

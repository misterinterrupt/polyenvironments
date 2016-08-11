window.irq = window.irq || {};
window.irq.SiS = window.irq.SiS || {};

$(document).ready(function() {

  // kick off the cloud process
  function initApp(p) {
    // shoving specifics about the sketch into global
    window.irq.SiS.xyPad1 = {
      enabled: false
    };
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
    var $display, $instructions, $title;
    $display = $("#status");
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
  var processing = new Processing(xyPad, initApp);
  if(!window.irq.SiS.xyPad1.enabled) {
    $(xyPad).hide();
  }

}); // end $.ready()

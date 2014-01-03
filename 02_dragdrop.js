var s = Snap("#workarea");
Snap.load("assets/xx_template.svg", function(f) {
  s.append(f);
});

function snapDrag(el) {
  var origTransform,
      onMove = function(dx, dy, x, y, e) {
        // dx, dy - shift from starting point
        // x, y - position of mouse
        // e - DOM event object
        this.attr({
          transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
        });
      },

      onStart = function() {
        origTransform = this.transform().local;
      };

  el.drag(onMove, onStart);
}

Snap.load("assets/scaling.svg", function(f) {
  s.append(f.select("#block"));
  var obj = s.select("#block");
  obj.attr("class", "block");
  snapDrag(obj);
  snapDrag(obj.clone().addTransform("translate(0, 75)"));
  snapDrag(obj.clone().addTransform("translate(0, 150)"));
});

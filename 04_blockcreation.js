var s = Snap("#workarea");
var library = null,
    trash = null;

Snap.load("assets/04_blockcreation.svg", function(f) {
  s.append(f);
  library = s.select("#library");
  trash = library.select("#trash");
});

// TODO(nikita): BBox for the trash can is reported incorrectly if it has a
//               transform applied. Figure out how to make it work correctly.

function blockDrag(el) {
  var origTransform,
      onMove = function(dx, dy, x, y, e) {
        // dx, dy - shift from starting point
        // x, y - position of mouse
        // e - DOM event object
        this.attr({
          transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
        });
        if (Snap.path.isBBoxIntersect(el.getSmartBBox(), trash.getSmartBBox())) {
          trash.select("#outline").attr({"fill": "#ff9494"});
        } else {
          trash.select("#outline").attr({"fill": "none"});
        }
      },

      onStart = function() {
        origTransform = this.transform().local;
      },

      onEnd = function() {
        trash.select("#outline").attr({"fill": "none"});
        if (Snap.path.isBBoxIntersect(el.getSmartBBox(), trash.getSmartBBox())) {
          el.remove();
        }
      };

  el.drag(onMove, onStart, onEnd);
}

function makeClonable(el) {
  var origTransform,
      clone,
      onMove = function(dx, dy, x, y, e) {
        // dx, dy - shift from starting point
        // x, y - position of mouse
        // e - DOM event object
        clone.attr({
          transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
        });
        if (Snap.path.isBBoxIntersect(clone.getSmartBBox(), trash.getSmartBBox())) {
          trash.select("#outline").attr({"fill": "#ff9494"});
        } else {
          trash.select("#outline").attr({"fill": "none"});
        }
      },

      onStart = function() {
        origTransform = this.transform().local;
        clone = this.clone();
      },

      onEnd = function() {
        trash.select("#outline").attr({"fill": "none"});
        if (Snap.path.isBBoxIntersect(clone.getSmartBBox(), trash.getSmartBBox())) {
          clone.remove();
        } else {
          blockDrag(clone);
        }
      };

  el.drag(onMove, onStart, onEnd);
}

Snap.load("assets/scaling.svg", function(f) {
  while (library === null) {}

  library.append(f.select("#block"));
  var obj = library.select("#block");
  obj.transform((new Snap.Matrix()).translate(600, 150));
  makeClonable(obj);

  var obj2 = obj.clone().addTransform((new Snap.Matrix()).translate(0, 75));
  obj2.select("text").attr("text", "text2");
  makeClonable(obj2);
});

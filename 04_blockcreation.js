var s = Snap("#workarea");
var library = null,
    x_loc = 600,
    y_loc = 20,
    x_inc = 0,
    y_inc = 45,
    trash = null;

Snap.load("assets/04_blockcreation.svg", function(f) {
  s.append(f);
  library = s.select("#library");
  trash = library.select("#trash");

  loadAssets("math.svg",
             "return_witharg.svg",
             "test_assign1.svg",
             "test_assign2.svg",
             "test_boolean1.svg",
             "test_boolean2.svg");
});

function loadAssets() {
  function loadAsset(i, asset) {
    console.log("assets/" + asset);
    Snap.load("assets/" + asset, function(f) {
      s.append(f.selectAll("pattern"));
      s.append(f.select("style"));
      library.append(f.select(".block"));
      var block_temp = s.select(".block");
      block_temp.attr("class", "")
      block_temp.transform((new Snap.Matrix()).translate(x_loc, y_loc));
      x_loc += x_inc;
      y_loc += y_inc;
      makeClonable(block_temp);
    });
  }
  $.each(arguments, loadAsset);
}

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

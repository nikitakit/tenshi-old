/* Custom plugins for Snap SVG

New static methods:
  Matrix.fromTransformString(tString, [format])
    * Creates a matrix based on an SVG transform string
    * This method performs formatting if a format specifier is given, e.g.
        Matrix.fromTransformString("scale({x}, {y})", el.getBBox())

New member methods:
  Element.addTransform(t)
    * Applies a transformation to an element, *on top of the existing one*
    * t can by an SVG transform string, or a Matrix
  Element.addTransformCentered(tString, [center='topleft'])
    * Applies a transformation relative to a given center (useful for scaling)
    * center may be 'topleft', 'topright', 'bottomleft', 'bottomright', 'center',
      or an object with fields x/y representing coordinates in the local geometry
  Element.dynamicSize(subelement, width, height)
    * Applied to a group element
    * Resize the subelement to have a given width/height, and reflow the rest of
      the group intelligently
    * subelement may be an Element, or a selector
    * If subelement is a selector, it should return a single object only
*/


Snap.plugin(function (Snap, Element, Paper, glob) {
  var elproto = Element.prototype,
      is = Snap.is,
      $ = Snap._.$;

  function svgTransform2string(tstr) {
    tstr = String(tstr);
    // copied from snap.svg.js
    var res = [];
    tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (all, name, params) {
      params = params.split(/\s*,\s*/);
      if (name == "rotate" && params.length == 1) {
        params.push(0, 0);
      }
      if (name == "scale") {
        if (params.length == 2) {
          params.push(0, 0);
        }
        if (params.length == 1) {
          params.push(params[0], 0, 0);
        }
      }
      if (name == "skewX") {
        res.push(["m", 1, 0, math.tan(rad(params[0])), 1, 0, 0]);
      } else if (name == "skewY") {
        res.push(["m", 1, math.tan(rad(params[0])), 0, 1, 0, 0]);
      } else {
        res.push([name.charAt(0)].concat(params));
      }
      return all;
    });
    return res;
  }

  Snap.Matrix.fromTransformString = function(tString, format) {
    // Create a matrix from an SVG transform string (optionally formatting it)
    if (arguments.length > 1) {
      tString = Snap.format(tString, format);
    }
    return Snap._.transform2matrix(svgTransform2string(tString), {
        x : -5,
        y : -5,
        width : 10,
        height : 10
      });
  }

  elproto.addTransform = function (t) {
    // Apply a transform to an element, on top of the transform it already has
    var mtx = this.transform().localMatrix;
    if (is(t, "string")) {
      t = Snap.Matrix.fromTransformString(t);
    }
    this.transform(mtx.add(t));
  }

  elproto.addTransformCentered = function (tString, center) {
    // Apply a transform to an element, on top of the transform it already has
    // Center the transform around a particular feature of the bounding box
    var c, x, y;
    if (arguments.length > 1) {
      c = center;
    } else {
      c = 'topleft';
    }

    if (is(c, 'string')) {
      switch(c) {
      case 'topleft':
        x = this.getBBox().x;
        y = this.getBBox().y;
        break;
      case 'topright':
        x = this.getBBox().x2;
        y = this.getBBox().y;
        break;
      case 'bottomleft':
        x = this.getBBox().x;
        y = this.getBBox().y2;
        break;
      case 'bottomright':
        x = this.getBBox().x2;
        y = this.getBBox().y2;
        break;
      case 'center':
        x = (this.getBBox().x + this.getBBox().x2) / 2;
        y = (this.getBBox().y + this.getBBox().y2) / 2;
        break;
      }
    } else {
      x = c.x;
      y = c.y;
    }

    var pos = Snap.Matrix.fromTransformString("translate({x}, {y})", {x:x, y:y});
    var mtx2 = Snap.Matrix.fromTransformString(tString);
    var neg = Snap.Matrix.fromTransformString("translate({x}, {y})", {x:-x, y:-y});

    this.addTransform(pos);
    this.addTransform(mtx2);
    this.addTransform(neg);
  }

  elproto.dynamicSize = function(subelement, width, height, exception) {
    // Dynamically scale subelement to have width/height
    if (typeof subelement === "string") {
      subelement = this.select(subelement);
    }
    if (arguments.length > 3) {
      exception = this.selectAll(exception);
    } else {
      exception = [];
    }

    var thresh_x = subelement.getBBox().x;
    var thresh_y = subelement.getBBox().y;

    var old_width = subelement.getBBox().width;
    var old_height = subelement.getBBox().height;

    subelement.addTransformCentered(Snap.format("scale({kx}, {ky})",
                                        {
                                          kx : width / old_width,
                                          ky : height / old_height
                                        }), 'topleft');

    var translation_x = Snap.format("translate({x}, {y})",
                                    {
                                      x: width - old_width,
                                      y: 0
                                    });
    var translation_y = Snap.format("translate({x}, {y})",
                                    {
                                      x: 0,
                                      y: height - old_height
                                    });

    this.selectAll("*").forEach(function(element) {
      if (element.type === "tspan") return;
      if (exception.length > 0) {
        var skip = false;
        exception.forEach(function(ex) {
          skip |= (ex === element);
        });
        if (skip) {
          return;
        }
      }

      if(element.getBBox().x > thresh_x) {
        element.addTransformCentered(translation_x, 'topleft');
      }
      if(element.getBBox().y > thresh_y) {
        element.addTransformCentered(translation_y, 'topleft');
      }
    });
  }
});

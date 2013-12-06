/* Custom plugins for Snap SVG

New static methods:
  Matrix.fromTransformString(tString, [format])
    * Creates a matrix based on an SVG transform string
    * This method performs formatting if a format specifier is given, e.g.
        Matrix.fromTransformString("scale({x}, {y})", el.getBBox())

New class: Snap.BBox
  new Snap.BBox(obj)
    * Converts the output of getBBox() into an object with methods
  Snap.BBox.keypoint(name)
    * Converts a keypoint name ('topleft', 'topright', 'bottomleft', 'bottomright',
      'center') into an object with x/y fields, relative to the BBox

New member methods:
  Element.addTransform(t, [center])
    * Applies a transformation to an element, *on top of the existing one*
    * t can by an SVG transform string, or a Matrix
    * center may be 'topleft', 'topright', 'bottomleft', 'bottomright', 'center',
      or an object with fields x/y representing coordinates in the local geometry
    * If center is specified, the transform is performed relative to that point
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
    //end copied
  }

  Snap.BBox = function (obj) {
    for(var key in obj) {
        this[key] = obj[key];
    }
  }

  Snap.BBox.prototype.keypoint = function(name) {
    if (!is(name, 'string')) {
      return name;
    }

    var x, y;
    switch(name) {
      case 'topleft':
        x = this.x;
        y = this.y;
        break;
      case 'topright':
        x = this.x2;
        y = this.y;
        break;
      case 'bottomleft':
        x = this.x;
        y = this.y2;
        break;
      case 'bottomright':
        x = this.x2;
        y = this.y2;
        break;
      case 'center':
        x = (this.x + this.x2) / 2;
        y = (this.y + this.y2) / 2;
        break;
    }
    return {x:x, y:y};
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

  elproto.addTransform = function (t, center) {
    // Apply a transform to an element, on top of the transform it already has
    // Optionally center the transform around a particular feature of the bounding box
    if (is(t, "string")) {
      t = Snap.Matrix.fromTransformString(tString);
    }

    if (arguments.length < 2) {
      return this.transform(this.transform().localMatrix.add(t))
    }

    var bbox = new Snap.BBox(this.getBBox());
    center = bbox.keypoint(center);

    return this.addTransform((new Snap.Matrix())
                      .translate(center.x, center.y)
                      .add(t)
                      .translate(-center.x, -center.y));
  }

  elproto.dynamicSize = function(subelement, width, height, exception) {
    // Dynamically scale subelement to have width/height
    if (is(subelement, "string")) {
      subelement = this.select(subelement);
    }
    if (arguments.length > 3) {
      exception = this.selectAll(exception);
    } else {
      exception = [];
    }

    var thresh_x = subelement.getBBox().x,
        thresh_y = subelement.getBBox().y,
        old_width = subelement.getBBox().width,
        old_height = subelement.getBBox().height,
        translation_x = (new Snap.Matrix()).translate(width - old_width, 0),
        translation_y = (new Snap.Matrix()).translate(0, height - old_height);

    subelement.addTransform((new Snap.Matrix()).scale(width / old_width, height / old_height), 'topleft');

    this.selectAll("*").forEach(function(element) {
      if (element.type === "tspan") return; // TODO(nikita): why do tspans cause bugs in Snap.svg?
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
        element.addTransform(translation_x, 'topleft');
      }
      if(element.getBBox().y > thresh_y) {
        element.addTransform(translation_y, 'topleft');
      }
    });
    return this;
  }
});

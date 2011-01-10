var MathFuncs = require('../../mathfuncs');
var Checkerboard = function() {};

Checkerboard.prototype.getValue = function(x, y, z) {

	var ix = Math.floor(MathFuncs.makeInt32Range(x));
	var iy = Math.floor(MathFuncs.makeInt32Range(x));
	var iz = Math.floor(MathFuncs.makeInt32Range(x));

    return (ix & 1 ^ iy & 1 ^ iz & 1) ? -1.0 : 1.0;

};

module.exports = Checkerboard;
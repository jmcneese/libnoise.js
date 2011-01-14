var Checkerboard = function() {};

Checkerboard.prototype.getValue = function(x, y, z) {

	var ix = Math.floor(MathFuncs.makeInt32Range(x));
	var iy = Math.floor(MathFuncs.makeInt32Range(y));
	var iz = Math.floor(MathFuncs.makeInt32Range(z));

    return (ix & 1 ^ iy & 1 ^ iz & 1) ? -1.0 : 1.0;

};

if(module) {

	var MathFuncs   = require('../../mathfuncs');

	module.exports  = Checkerboard;

} else {

	require('mathfuncs');

}
var MathConsts = require('../mathconsts');
var Sphere = function(module) {

	if(!module) {

		throw new Error('Invalid or missing module!');

	}

	this.module = module;

};

Sphere.prototype.getValue = function(lat, lon) {

	var r = Math.cos(MathConsts.DEG_TO_RAD * lat);

	return this.module.getValue(
		Math.cos(MathConsts.DEG_TO_RAD * lon) * r,
		Math.sin(MathConsts.DEG_TO_RAD * lat),
		Math.sin(MathConsts.DEG_TO_RAD * lon) * r
	);

};

module.exports = Sphere;
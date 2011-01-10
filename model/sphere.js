var MathConsts = require('../mathconsts');
var Sphere = function(module) {

	this.module = module || null;

};

Sphere.prototype.getValue = function(lat, lon) {

	if(!this.module) {

		throw new Error('Invalid or missing module!');

	}

	var r = Math.cos(MathConsts.DEG_TO_RAD * lat);

	return this.module.getValue(
		Math.cos(MathConsts.DEG_TO_RAD * lon) * r,
		Math.sin(MathConsts.DEG_TO_RAD * lat),
		Math.sin(MathConsts.DEG_TO_RAD * lon) * r
	);

};

module.exports = Sphere;
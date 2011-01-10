var MathConsts = require('../mathconsts');

var Cylinder = function(module) {

	this.module = module || null;

};

Cylinder.prototype.getValue = function(angle, y) {

	if(!this.module) {

		throw new Error('Invalid or missing module!');

	}

	var i = parseFloat(angle) * MathConsts.DEG_TO_RAD;

	return this.module.getValue(Math.cos(i), y, Math.sin(i));

};

module.exports = Cylinder;
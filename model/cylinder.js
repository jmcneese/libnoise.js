var MathConsts = require('../mathconsts');

var Cylinder = function(module) {

	if(!module) {

		throw new Error('Invalid or missing module!');

	}

	this.module = module;

};

Cylinder.prototype.getValue = function(angle, y) {

	var i = parseFloat(angle) * MathConsts.DEG_TO_RAD;

	return this.module.getValue(Math.cos(i), y, Math.sin(i));

};

module.exports = Cylinder;
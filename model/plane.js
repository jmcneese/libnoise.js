var Plane = function(module) {

	if(!module) {

		throw new Error('Invalid or missing module!');

	}

	this.module = module;

};

Plane.prototype.getValue = function(x, y) {

	return this.module.getValue(x, 0, y);

};

module.exports = Plane;
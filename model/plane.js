var Plane = function(module) {

	this.module = module || null;

};

Plane.prototype.getValue = function(x, y) {

	if(!this.module) {

		throw new Error('Invalid or missing module!');

	}

	return this.module.getValue(x, 0, y);

};

module.exports = Plane;
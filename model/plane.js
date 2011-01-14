var Plane = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

Plane.prototype.getValue = function(x, y) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing module!');

	}

	return this.sourceModule.getValue(x, 0, y);

};

if(module) {

	module.exports = Plane;

}
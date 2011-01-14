var Invert = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

Invert.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return -this.sourceModule.getValue(x, y, z);

};

if(module) {

	module.exports = Invert;

}
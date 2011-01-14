var Abs = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

Abs.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return Math.abs(this.sourceModule.getValue(x, y, z));

};

if(module) {

	module.exports = Abs;

}
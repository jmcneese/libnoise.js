var Add = function(sourceModules) {

	this.sourceModules = sourceModules || null;

};

Add.prototype.getValue = function(x, y, z) {


	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModules[0].getValue(x, y, z) + this.sourceModules[1].getValue(x, y, z);

};

if(module) {

	module.exports = Add;

}
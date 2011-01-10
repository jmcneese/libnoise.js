var ModuleBase = function(sourceModules) {

	this.sourceModules = sourceModules || [];

};

ModuleBase.prototype.getSourceModule = function(i) {

	if (i >= this.sourceModules.length || i < 0 || this.sourceModules[i] === null) {

		throw new Error('No such source module!');

	}

	return this.sourceModules[i];

};

ModuleBase.prototype.setSourceModule = function(i, module) {

	if(typeof i == 'undefined' || i === null) {

		i = 0;

	}

	if ((this.sourceModules.length > 1 && i >= this.sourceModules.length) || i < 0) {

		throw new Error('Invalid index for source module!');

	}

	this.sourceModules[i] = module;

};

module.exports = ModuleBase;
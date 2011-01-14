var Clamp = function(sourceModule, lowerBound, upperBound) {

	this.sourceModule   = sourceModule  || null;
	this.lowerBound     = lowerBound    || null;
	this.upperBound     = upperBound    || null;


};

Clamp.prototype = {

	get lowerBound() {

		return this._lowerBound;

	},

	set lowerBound(v) {

		if (v > this.upperBound) {

			throw new Error('Lower bound cannot exceed upper bound!');

		}

		this._lowerBound = v;

	},

	get upperBound() {

		return this._upperBound;

	},

	set upperBound(v) {

		if (v < this.lowerBound) {

			throw new Error('Upper bound cannot be less than lower bound!');

		}

		this._upperBound = v;

	},

	getValue: function(x, y, z) {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing source module!');

		}

		return Misc.clampValue(this.sourceModule.getValue(x, y, z), this.lowerBound, this.upperBound);

	},

	setBounds: function(lowerBound, upperBound) {

		this.upperBound = upperBound;
		this.lowerBound = lowerBound;

	}

};

if(module) {

	var Misc = require('../../misc');

	module.exports = Clamp;

} else {

	require('misc');

}
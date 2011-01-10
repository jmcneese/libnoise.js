var Clamp = function(sourceModule, lower, upper) {

	if (lower && upper && lower > upper) {

		throw new Error('Lower bound cannot exceed upper bound!');

	}

	this.lowerBound     = lower || null;
	this.upperBound     = upper || null;
	this.sourceModule   = sourceModule || null;

};

Clamp.prototype.setBounds = function(lower, upper) {

	if (lower > upper) {

		throw new Error('Lower bound cannot exceed upper bound!');

	}

	this.upperBound = upper;
	this.lowerBound = lower;

};

Clamp.prototype.getValue = function(x, y, z) {

	if (!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	var value = this.sourceModule.getValue(x, y, z);

	if (value < this.lowerBound) {

		return this.lowerBound;

	} else if (value > this.upperBound) {

		return this.upperBound;

	}

	return value;

};

module.exports = Clamp;
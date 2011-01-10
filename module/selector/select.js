var Interpolation = require('../../interpolation');
var Select = function(sourceModules, controlModule, edge, lower, upper) {

	this.__defineSetter__('lowerBound', function(v) {

		if (v > this.upperBound) {

			throw new Error('Lower bound cannot exceed upper bound!');

		}

		this.lowerBound = v;

	});

	this.__defineSetter__('upperBound', function(v) {

		if (v < this.lowerBound) {

			throw new Error('Upper bound cannot be less than lower bound!');

		}

		this.upperBound = v;

	});

	this.__defineSetter__('edge', function(v) {

		// Make sure that the edge falloff curves do not overlap.
		var size = this.upperBound - this.lowerBound;
		var half = size / 2;

		this.edge = (v > half) ? half : v;

	});

	this.sourceModules = sourceModules || [];
	this.controlModule = controlModule || null;
	this.upperBound = upper || Select.DEFAULT_SELECT_UPPER_BOUND;
	this.lowerBound = lower || Select.DEFAULT_SELECT_LOWER_BOUND;
	this.edge = edge || Select.DEFAULT_SELECT_EDGE_FALLOFF;

};

/// Default edge-falloff value
Select.DEFAULT_SELECT_EDGE_FALLOFF = 0.0;

/// Default lower bound of the selection range
Select.DEFAULT_SELECT_LOWER_BOUND = -1.0;

/// Default upper bound of the selection range
Select.DEFAULT_SELECT_UPPER_BOUND = 1.0;

Select.prototype.setBounds = function(lower, upper) {

	this.upperBound = upper;
	this.lowerBound = lower;

};


Select.prototype.getValue = function(x, y, z) {

	if (!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module(s)!');

	}

	if (!this.controlModule) {

		throw new Error('Invalid or missing control module!');

	}

	var lowerCurve, upperCurve;
	var controlValue = this.controlModule.getValue(x, y, z);

	if (this.edge > 0.0) {

		if (controlValue < (this.lowerBound - this.edge)) {

			// The output value from the control module is below the selector
			// threshold; return the output value from the first source module.
			return this.sourceModules[0].getValue(x, y, z);

		} else if (controlValue < (this.lowerBound + this.edge)) {

			// The output value from the control module is near the lower end of the
			// selector threshold and within the smooth curve. Interpolate between
			// the output values from the first and second source modules.
			lowerCurve = parseFloat(this.lowerBound - this.edge);
			upperCurve = parseFloat(this.lowerBound + this.edge);

			return Interpolation.linear(
				this.sourceModules[0].getValue(x, y, z),
				this.sourceModules[1].getValue(x, y, z),
				Interpolation.cubicSCurve((controlValue - lowerCurve) / (upperCurve - lowerCurve))
			);

		} else if (controlValue < (this.upperBound - this.edge)) {

			// The output value from the control module is within the selector
			// threshold; return the output value from the second source module.
			return this.sourceModules[1].getValue(x, y, z);

		} else if (controlValue < (this.upperBound + this.edge)) {

			// The output value from the control module is near the upper end of the
			// selector threshold and within the smooth curve. Interpolate between
			// the output values from the first and second source modules.
			lowerCurve = parseFloat(this.upperBound - this.edge);
			upperCurve = parseFloat(this.upperBound + this.edge);

			return Interpolation.linear(
				this.sourceModules[1].getValue(x, y, z),
				this.sourceModules[0].getValue(x, y, z),
				Interpolation.cubicSCurve((controlValue - lowerCurve) / (upperCurve - lowerCurve))
			);

		}

		// Output value from the control module is above the selector threshold;
		// return the output value from the first source module.
		return this.sourceModules[0].getValue(x, y, z);

	} else {

		return (controlValue < this.lowerBound || controlValue > this.upperBound)
			? this.sourceModules[0].getValue(x, y, z)
			: this.sourceModules[1].getValue(x, y, z);

	}


};

module.exports = Select;
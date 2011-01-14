var Terrace = function(sourceModule, controlPoints, invert) {

	this.sourceModule   = sourceModule  || null;
	this.controlPoints  = controlPoints || [];
	this.invert         = invert        || false;

};

Terrace.prototype.findInsertionPos = function(value) {

	value = parseFloat(value);

	for (var insertionPos = 0; insertionPos < this.controlPoints.length; insertionPos++) {

		if (value < this.controlPoints[insertionPos]) {

			// We found the array index in which to insert the new control point.
			// Exit now.
			break;

		} else if (value == this.controlPoints[insertionPos]) {

			// Each control point is required to contain a unique value, so throw
			// an exception.
			throw new Error('Invalid parameter');

		}

	}

	return insertionPos;

};

Terrace.prototype.insertAtPos = function (insertionPos, value) {

	insertionPos    = parseInt(insertionPos);
	value           = parseFloat(value);

	// Make room for the new control point at the specified position within
	// the control point array.  The position is determined by the value of
	// the control point; the control points must be sorted by value within
	// that array.
	var newControlPoints = [];

	for (var i = 0; i < this.controlPoints.length; i++) {

		if (i < insertionPos) {

			newControlPoints[i] = this.controlPoints[i];

		} else {

			newControlPoints[i + 1] = this.controlPoints[i];

		}

	}

	this.controlPoints = newControlPoints;

	// Now that we've made room for the new control point within the array,
	// add the new control point.
	this.controlPoints[insertionPos] = value;

};

Terrace.prototype.addControlPoint = function(value) {

	value = parseFloat(value);

	// Find the insertion point for the new control point and insert the new
	// point at that position.  The control point array will remain sorted by
	// value.
	this.insertAtPos(this.findInsertionPos(value), value);

};

Terrace.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	// Get the output value from the source module.
	var sourceModuleValue = this.sourceModule.getValue(x, y, z);

	// Find the first element in the control point array that has a value
	// larger than the output value from the source module.
	for (var indexPos = 0; indexPos < this.controlPoints.length; indexPos++) {

		if (sourceModuleValue < this.controlPoints[indexPos]) {

			break;

		}

	}

	// Find the two nearest control points so that we can map their values
	// onto a quadratic curve.
	var index0 = Misc.clampValue(indexPos - 1, 0, this.controlPoints.length - 1);
	var index1 = Misc.clampValue(indexPos, 0, this.controlPoints.length - 1);

	// If some control points are missing (which occurs if the output value from
	// the source module is greater than the largest value or less than the
	// smallest value of the control point array), get the value of the nearest
	// control point and exit now.
	if (index0 == index1) {

		return this.controlPoints[index1];

	}

	// Compute the alpha value used for linear interpolation.
	var value0 = this.controlPoints[index0];
	var value1 = this.controlPoints[index1];
	var alpha = (sourceModuleValue - value0) / (value1 - value0);

	if (this.invert) {

		var swapped = Misc.swapValues([value0, value1]);

		alpha -= 1.0;
		value0 = swapped[0];
		value1 = swapped[1];

	}

	// Squaring the alpha produces the terrace effect.
	alpha *= alpha;

	// Now perform the linear interpolation given the alpha value.
	return Interpolation.linear(value0, value1, alpha);

};

if(module) {

	var Misc            = require('../../misc');
	var Interpolation   = require('../../interpolation');

	module.exports      = Terrace;

} else {

	require(['misc', 'interpolation']);

}
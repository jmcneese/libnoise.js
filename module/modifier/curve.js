var Curve = function(sourceModule, controlPoints) {

	this.sourceModule   = sourceModule || null;
	this.controlPoints  = controlPoints|| [];

};

Curve.prototype.findInsertionPos = function(value) {

	value = parseFloat(value);

	for (var position = 0; position < this.controlPoints.length; position++) {

		if (value < this.controlPoints[position]) {

			// We found the array index in which to insert the new control point.
			// Exit now.
			break;

		} else if (value == this.controlPoints[position]) {

			// Each control point is required to contain a unique value, so throw
			// an exception.
			throw new Error('Invalid parameter');

		}

	}

	return position;

};

Curve.prototype.insertAtPos = function (position, input, output) {

	position = parseInt(position);
	input = parseFloat(input);
	output = parseFloat(output);

	// Make room for the new control point at the specified position within
	// the control point array.  The position is determined by the value of
	// the control point; the control points must be sorted by value within
	// that array.
	var newControlPoints = [];

	for (var i = 0; i < this.controlPoints.length; i++) {

		if (i < position) {

			newControlPoints[i] = this.controlPoints[i];

		} else {

			newControlPoints[i + 1] = this.controlPoints[i];

		}

	}

	this.controlPoints = newControlPoints;

	// Now that we've made room for the new control point within the array,
	// add the new control point.
	this.controlPoints[position] = [input, output];

};

Curve.prototype.addControlPoint = function(input, output) {

	input = parseFloat(input);
	output = parseFloat(output);

	// Find the insertion point for the new control point and insert the new
	// point at that position.  The control point array will remain sorted by
	// input value.
	this.insertAtPos(this.findInsertionPos(input), input, output);

};

Curve.prototype.getValue = function(x, y, z) {

	if (!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	if (!this.controlPoints.length >= 4) {

		throw new Error('Insufficient number of control points!');

	}

	// Get the output value from the source module.
	var value = this.sourceModule.getValue(x, y, z);

	// Find the first element in the control point array that has an input value
	// larger than the output value from the source module.
	for (var indexPos = 0; indexPos < this.controlPoints.length; indexPos++) {

		if (value < this.controlPoints[indexPos][0]) {

			break;

		}

	}

	// Find the four nearest control points so that we can perform cubic
	// interpolation.
	var index0 = Misc.clampValue(indexPos - 2, 0, this.controlPoints.length - 1);
	var index1 = Misc.clampValue(indexPos - 1, 0, this.controlPoints.length - 1);
	var index2 = Misc.clampValue(indexPos, 0, this.controlPoints.length - 1);
	var index3 = Misc.clampValue(indexPos + 1, 0, this.controlPoints.length - 1);

	// If some control points are missing (which occurs if the value from the
	// source module is greater than the largest input value or less than the
	// smallest input value of the control point array), get the corresponding
	// output value of the nearest control point and exit now.
	if (index1 == index2) {

		return this.controlPoints[index1][1];

	}

	// Compute the alpha value used for cubic interpolation.
	var input0 = this.controlPoints[index1][0];
	var input1 = this.controlPoints[index2][0];
	var alpha = (value - input0) / (input1 - input0);

	// Now perform the cubic interpolation given the alpha value.
	return Interpolation.cubic(
		this.controlPoints[index0][1],
		this.controlPoints[index1][1],
		this.controlPoints[index2][1],
		this.controlPoints[index3][1],
		alpha
	);

};

if(module) {

	var Misc            = require('../../misc');
	var Interpolation   = require('../../interpolation');

	module.exports      = Curve;

} else {

	require(['misc', 'interpolation']);

}
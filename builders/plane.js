var Interpoliation = require('../interpolation');
var NoiseMap = require('../noisemap');
var Plane = require('../model/plane');
var NoiseMapBuilderPlane = function(sourceModule, width, height, seamless) {

	this.sourceModule   = sourceModule  || null;
	this.width          = width         || 256;
	this.height         = height        || 256;
	this.seamless       = seamless      || null;

	this.lowerXBound    = 0.0;
	this.lowerYBound    = 0.0;
	this.upperXBound    = 1.0;
	this.upperYBound    = 1.0;

	this.noiseMap       = new NoiseMap(this.width, this.height);

};

NoiseMapBuilderPlane.prototype = {

	get lowerXBound() {

		return this._lowerXBound;

	},

	set lowerXBound(v) {

		if (v >= this.upperXBound) {

			throw new Error('Lower bound cannot equal or exceed upper bound!');

		}

		this._lowerXBound = v;

	},

	get lowerYBound() {

		return this._lowerYBound;

	},

	set lowerYBound(v) {

		if (v >= this.upperYBound) {

			throw new Error('Lower bound cannot equal or exceed upper bound!');

		}

		this._lowerYBound = v;

	},

	get upperXBound() {

		return this._upperXBound;

	},

	set upperXBound(v) {

		if (v <= this.upperXBound) {

			throw new Error('Upper bound cannot equal or exceed upper bound!');

		}

		this._upperXBound = v;

	},

	get upperYBound() {

		return this._upperYBound;

	},

	set upperYBound(v) {

		if (v <= this.upperYBound) {

			throw new Error('Upper bound cannot equal or exceed upper bound!');

		}

		this._upperYBound = v;

	},

	build: function() {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing module!');

		}

		// Create the cylinder model.
		var plane   = new Plane(this.sourceModule);
		var xExtent = this.upperXBound - this.lowerXBound;
		var yExtent = this.upperYBound - this.lowerYBound;
		var xDelta  = xExtent / this.width;
		var yDelta  = yExtent / this.height;
		var curX    = this.lowerXBound;
		var curY    = this.lowerYBound;
		var value, xBlend;

		// Fill every point in the noise map with the output values from the model.
		for (var y = 0; y < this.height; y++) {

			curX = this.lowerXBound;

			for (var x = 0; x < this.width; x++) {

				if(!this.seamless) {

					value = plane.getValue(x, y);

				} else {

					xBlend = 1.0 - ((curX - this.lowerXBound) / xExtent);

					value = Interpolation.linear(
						Interpolation.linear(
							plane.getValue(curX, curY),
							plane.getValue(curX + xExtent, curY),
							xBlend
						),
						Interpolation.linear(
							plane.getValue(curX, curY + yExtent),
							plane.getValue(curX + xExtent, curY + yExtent),
							xBlend
						),
						1.0 - ((curY - this.lowerYBound) / yExtent)
					);
				}

				this.noiseMap.setValue(x, y, value);

				curX += xDelta;

			}

			curY += yDelta;

		}

		return this.noiseMap;

	},

	setBounds: function(lowerXBound, lowerYBound, upperXBound, upperYBound) {

		this.lowerXBound    = lowerXBound;
		this.lowerYBound   = lowerYBound;
		this.upperXBound    = upperXBound;
		this.upperYBound   = upperYBound;

	}

};

if (module) {

	module.exports = NoiseMapBuilderPlane;

} else {

	exports = NoiseMapBuilderPlane;

}
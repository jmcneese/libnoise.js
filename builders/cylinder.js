var NoiseMapBuilderCylinder = function(sourceModule, width, height) {

	this.sourceModule       = sourceModule  || null;
	this.width              = width         || 256;
	this.height             = height        || 256;

	this.lowerAngleBound    = 0.0;
	this.lowerHeightBound   = 0.0;
	this.upperAngleBound    = 1.0;
	this.upperHeightBound   = 1.0;

	this.noiseMap           = new NoiseMap(this.width, this.height);

};

NoiseMapBuilderCylinder.prototype = {

	get lowerAngleBound() {

		return this._lowerAngleBound;

	},

	set lowerAngleBound(v) {

		if (v >= this.upperAngleBound) {

			throw new Error('Lower bound cannot equal or exceed upper bound!');

		}

		this._lowerAngleBound = v;

	},

	get lowerHeightBound() {

		return this._lowerHeightBound;

	},

	set lowerHeightBound(v) {

		if (v >= this.upperHeightBound) {

			throw new Error('Lower bound cannot equal or exceed upper bound!');

		}

		this._lowerHeightBound = v;

	},

	get upperAngleBound() {

		return this._upperAngleBound;

	},

	set upperAngleBound(v) {

		if (v <= this.upperAngleBound) {

			throw new Error('Upper bound cannot equal or exceed upper bound!');

		}

		this._upperAngleBound = v;

	},

	get upperHeightBound() {

		return this._upperHeightBound;

	},

	set upperHeightBound(v) {

		if (v <= this.upperHeightBound) {

			throw new Error('Upper bound cannot equal or exceed upper bound!');

		}

		this._upperHeightBound = v;

	},

	build: function() {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing module!');

		}

		// Create the cylinder model.
		var cylinder    = new Cylinder(this.sourceModule);
		var xDelta      = (this.upperAngleBound  - this.lowerAngleBound)  / this.width;
		var yDelta      = (this.upperHeightBound - this.lowerHeightBound) / this.height;
		var curAngle    = this.lowerAngleBound;
		var curHeight   = this.lowerHeightBound;

		// Fill every point in the noise map with the output values from the model.
		for (var y = 0; y < this.height; y++) {

			curAngle = this.lowerAngleBound;

			for (var x = 0; x < this.width; x++) {

				this.noiseMap.setValue(x, y, cylinder.getValue(curAngle, curHeight));

				curAngle += xDelta;

			}

			curHeight += yDelta;

		}

		return this.noiseMap;

	},

	setBounds: function(lowerAngleBound, lowerHeightBound, upperAngleBound, upperHeightBound) {

		this.lowerAngleBound    = lowerAngleBound;
		this.lowerHeightBound   = lowerHeightBound;
		this.upperAngleBound    = upperAngleBound;
		this.upperHeightBound   = upperHeightBound;

	}

};

if (module) {

	var NoiseMap    = require('../noisemap');
	var Cylinder    = require('../model/cylinder');

	module.exports  = NoiseMapBuilderCylinder;

} else {

	require(['noisemap', 'model/cylinder']);

}
var NoiseMapBuilderSphere = function(sourceModule, width, height) {

	this.sourceModule   = sourceModule  || null;
	this.width          = width         || 256;
	this.height         = height        || 256;

	this.northLatBound  = 0.0;
	this.southLatBound  = 0.0;
	this.eastLonBound   = 0.0;
	this.westLonBound   = 0.0;

	this.noiseMap       = new NoiseMap(this.width, this.height);

};

NoiseMapBuilderSphere.prototype = {

	get eastLonBound() {

		return this._eastLonBound;

	},

	set eastLonBound(v) {

		if (v <= this.westLonBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._eastLonBound = v;

	},

	get northLatbound() {

		return this._northLatbound;

	},

	set northLatbound(v) {

		if (v <= this.southLatBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._northLatbound = v;

	},

	get southLatBound() {

		return this._southLatBound;

	},

	set southLatBound(v) {

		if (v >= this.northLatBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._westLonBound = v;

	},

	get westLonBound() {

		return this._westLonBound;

	},

	set westLonBound(v) {

		if (v >= this.eastLonBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._westLonBound = v;

	},

	build: function() {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing module!');

		}

		// Create the cylinder model.
		var sphere  = new Sphere(this.sourceModule);
		var xDelta  = (this.eastLonBound  - this.westLonBound)  / this.width;
		var yDelta  = (this.northLatbound - this.southLatBound) / this.height;
		var curLon  = this.westLonBound;
		var curLat  = this.eastLonBound;

		// Fill every point in the noise map with the output values from the model.
		for (var y = 0; y < this.height; y++) {

			curLon = this.westLonBound;

			for (var x = 0; x < this.width; x++) {

				this.noiseMap.setValue(x, y, sphere.getValue(curLat, curLon));

				curLon += xDelta;

			}

			curLat += yDelta;

		}

		return this.noiseMap;

	},

	setBounds: function(westLonBound, eastLonBound, southLatBound, northLatBound) {

		this.westLonBound   = westLonBound;
		this.eastLonBound   = eastLonBound;
		this.southLatBound  = southLatBound;
		this.northLatBound  = northLatBound;

	}

};

if (module) {

	var NoiseMap    = require('../noisemap');
	var Sphere      = require('../model/sphere');

	module.exports  = NoiseMapBuilderSphere;

} else {

	require(['noisemap', 'model/sphere']);

}
var NoiseGen = require('../../noisegen');
var MathFuncs = require('../../mathfuncs');
var Misc = require('../../misc');
var RidgedMulti = function(f, l, oct, s, q, offset, gain, w) {

	this.__defineSetter__('lacunarity', function(v) {

		this.lacunarity = v;

		var h           = 1.0;
		var frequency   = 1.0;

		for (var i = 0; i < RidgedMulti.RIDGED_MAX_OCTAVE; i++) {

			// Compute weight for each frequency.
			this.weights[i]  = Math.pow(frequency, -h);
			frequency       *= this.lacunarity;

		}

	});

	this.frequency  = f     || RidgedMulti.DEFAULT_RIDGED_FREQUENCY;
	this.lacunarity = l     || RidgedMulti.DEFAULT_RIDGED_LACUNARITY;
	this.octaves    = oct   || RidgedMulti.DEFAULT_RIDGED_OCTAVE_COUNT;
	this.seed       = s     || RidgedMulti.DEFAULT_RIDGED_SEED;
	this.quality    = q     || NoiseGen.QUALITY_STD;
	this.offset     = offset|| 1.0;
	this.gain       = gain  || 2.0;
	this.weights    = w     || [];

};

RidgedMulti.DEFAULT_RIDGED_FREQUENCY = 1.0;
RidgedMulti.DEFAULT_RIDGED_LACUNARITY = 2.0;
RidgedMulti.DEFAULT_RIDGED_QUALITY = NoiseGen.QUALITY_STD;
RidgedMulti.DEFAULT_RIDGED_OCTAVE_COUNT = 6;
RidgedMulti.DEFAULT_RIDGED_SEED = 0;
RidgedMulti.RIDGED_MAX_OCTAVE = 30;

RidgedMulti.prototype.getValue = function(x, y, z) {

	var nx, ny, nz, seed;

	var value   = 0.0;
	var signal  = 0.0;
	var weight  = 1.0;

	x           = parseFloat(x * this.frequency);
	y           = parseFloat(y * this.frequency);
	z           = parseFloat(z * this.frequency);

	for (var octave = 0; octave < this.octaves; octave++) {

		// Make sure that these floating-point values have the same range as a 32-
		// bit integer so that we can pass them to the coherent-noise functions.
		nx      = MathFuncs.makeInt32Range(x);
		ny      = MathFuncs.makeInt32Range(y);
		nz      = MathFuncs.makeInt32Range(z);

		// Get the coherent-noise value.
		seed    = (this.seed + octave) & 0x7fffffff;
		signal  = NoiseGen.gradientCoherentNoise3D(nx, ny, nz, seed, this.quality);

		// Make the ridges.
		signal  = Math.abs(signal);
		signal  = this.offset - signal;

		// Square the signal to increase the sharpness of the ridges.
		signal *= signal;

		// The weighting from the previous octave is applied to the signal.
		// Larger values have higher weights, producing sharp points along the
		// ridges.
		signal *= weight;

		// Weight successive contributions by the previous signal.
		weight  = signal * this.gain;

		// Clamp value to within 0 and 1
		weight  = Misc.clampValue(weight, 0.0, 1.0);

		// Add the signal to the output value.
		value  += (signal * this.weights[octave]);

		// Go to the next octave.
		x      *= this.lacunarity;
		y      *= this.lacunarity;
		z      *= this.lacunarity;

	}

	return (value * 1.25) - 1.0;

};

module.exports = RidgedMulti;
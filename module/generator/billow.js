var NoiseGen = require('../../noisegen');

var Billow = function(f, l, o, p, s, q) {

	this.frequency  = f || Billow.DEFAULT_BILLOW_FREQUENCY;
	this.lacunarity = l || Billow.DEFAULT_BILLOW_LACUNARITY;
	this.octaves    = o || Billow.DEFAULT_BILLOW_OCTAVE_COUNT;
	this.persist    = p || Billow.DEFAULT_BILLOW_PERSISTENCE;
	this.seed       = s || Billow.DEFAULT_BILLOW_SEED;
	this.quality    = q || NoiseGen.QUALITY_STD;

};

Billow.DEFAULT_BILLOW_FREQUENCY = 1.0;
Billow.DEFAULT_BILLOW_LACUNARITY = 2.0;
Billow.DEFAULT_BILLOW_QUALITY = NoiseGen.QUALITY_STD;
Billow.DEFAULT_BILLOW_OCTAVE_COUNT = 6;
Billow.DEFAULT_BILLOW_PERSISTENCE = 0.5;
Billow.DEFAULT_BILLOW_SEED = 0;
Billow.BILLOW_MAX_OCTAVE = 30;

Billow.prototype.getValue = function(x, y, z) {

	var nx, ny, nz;
	var value   = 0.0;
	var signal  = 0.0;
	var persist = 1.0;

	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z * this.frequency);

	for (var octave = 0; octave < this.octaves; octave++) {

		// Make sure that these floating-point values have the same range as a 32-
		// bit integer so that we can pass them to the coherent-noise functions.
		nx       = NoiseGen.makeInt32Range(x);
		ny       = NoiseGen.makeInt32Range(y);
		nz       = NoiseGen.makeInt32Range(z);

		// Get the coherent-noise value from the input value and add it to the final result.
		signal   = 2.0 * Math.abs(NoiseGen.gradientCoherentNoise3D(nx, ny, nz, ((this.seed + octave) & 0xffffffff), this.quality)) - 1.0;
		value   += signal * persist;

		// Prepare the next octave.
		x       *= this.lacunarity;
		y       *= this.lacunarity;
		z       *= this.lacunarity;
		persist *= this.persist;

	}

	value += 0.5;

	return value;

};

module.exports = Billow;
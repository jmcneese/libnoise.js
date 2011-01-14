var Perlin = function(frequency, lacunarity, octaves, persist, seed, quality) {

	this.frequency  = frequency     || Perlin.DEFAULT_PERLIN_FREQUENCY;
	this.lacunarity = lacunarity    || Perlin.DEFAULT_PERLIN_LACUNARITY;
	this.octaves    = octaves       || Perlin.DEFAULT_PERLIN_OCTAVE_COUNT;
	this.persist    = persist       || Perlin.DEFAULT_PERLIN_PERSISTENCE;
	this.seed       = seed          || Perlin.DEFAULT_PERLIN_SEED;
	this.quality    = quality       || NoiseGen.QUALITY_STD;

};

Perlin.DEFAULT_PERLIN_FREQUENCY     = 1.0;
Perlin.DEFAULT_PERLIN_LACUNARITY    = 2.0;
Perlin.DEFAULT_PERLIN_OCTAVE_COUNT  = 6;
Perlin.DEFAULT_PERLIN_PERSISTENCE   = 0.5;
Perlin.DEFAULT_PERLIN_SEED          = 0;
Perlin.PERLIN_MAX_OCTAVE            = 30;

Perlin.prototype.getValue = function(x, y, z) {

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
		nx       = MathFuncs.makeInt32Range(x);
		ny       = MathFuncs.makeInt32Range(y);
		nz       = MathFuncs.makeInt32Range(z);

		// Get the coherent-noise value from the input value and add it to the final result.
		signal   = NoiseGen.gradientCoherentNoise3D(nx, ny, nz, ((this.seed + octave) & 0xffffffff), this.quality);
		value   += signal * persist;

		// Prepare the next octave.
		x       *= this.lacunarity;
		y       *= this.lacunarity;
		z       *= this.lacunarity;
		persist *= this.persist;

	}

	return value;

};

if(module) {

	var NoiseGen = require('../../noisegen');
	var MathFuncs = require('../../mathfuncs');

	module.exports = Perlin;

} else {

	require(['noisegen', 'mathfuncs']);

}
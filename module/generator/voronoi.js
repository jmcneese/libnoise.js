var Voronoi = function(frequency, displacement, distance, seed) {

	this.frequency      = frequency     || Voronoi.DEFAULT_VORONOI_FREQUENCY;
	this.displacement   = displacement  || Voronoi.DEFAULT_VORONOI_DISPLACEMENT;
	this.distance       = distance      || false;
	this.seed           = seed          || Voronoi.DEFAULT_VORONOI_SEED;

};

Voronoi.DEFAULT_VORONOI_DISPLACEMENT    = 1.0;
Voronoi.DEFAULT_VORONOI_FREQUENCY       = 1.0;
Voronoi.DEFAULT_VORONOI_SEED            = 0;

Voronoi.prototype.getValue = function(x, y, z) {

	// This method could be more efficient by caching the seed values.
	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z * this.frequency);

	var xPos, yPos, zPos, xDist, yDist, zDist, dist;

	var xi          = parseInt(x);
	var yi          = parseInt(y);
	var zi          = parseInt(z);
	var xInt        = (x > 0.0 ? xi : xi - 1);
	var yInt        = (y > 0.0 ? yi : yi - 1);
	var zInt        = (z > 0.0 ? zi : zi - 1);
	var minDist     = 2147483647.0;
	var xCandidate  = 0;
	var yCandidate  = 0;
	var zCandidate  = 0;
	var value       = 0.0;

	// Inside each unit cube, there is a seed point at a random position.  Go
	// through each of the nearby cubes until we find a cube with a seed point
	// that is closest to the specified position.
	for (var zCur = zInt - 2; zCur <= zInt + 2; zCur++) {

		for (var yCur = yInt - 2; yCur <= yInt + 2; yCur++) {

			for (var xCur = xInt - 2; xCur <= xInt + 2; xCur++) {

				// Calculate the position and distance to the seed point inside of
				// this unit cube.
				xPos    = parseFloat(xCur + NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed));
				yPos    = parseFloat(yCur + NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed + 1));
				zPos    = parseFloat(zCur + NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed + 2));
				xDist   = parseFloat(xPos - x);
				yDist   = parseFloat(yPos - y);
				zDist   = parseFloat(zPos - z);
				dist    = parseFloat(xDist * xDist + yDist * yDist + zDist * zDist);

				if (dist < minDist) {

					// This seed point is closer to any others found so far, so record
					// this seed point.
					minDist     = dist;
					xCandidate  = xPos;
					yCandidate  = yPos;
					zCandidate  = zPos;

				}

			}

		}

	}

	if (this.distance) {

		// Determine the distance to the nearest seed point.
		xDist = xCandidate - x;
		yDist = yCandidate - y;
		zDist = zCandidate - z;
		value = (Math.sqrt(xDist * xDist + yDist * yDist + zDist * zDist)) * MathConsts.SQRT_3 - 1.0;

	}

	// Return the calculated distance with the displacement value applied.
	return value + (
		this.displacement * NoiseGen.valueNoise3D(
			parseInt(Math.floor(xCandidate)),
			parseInt(Math.floor(yCandidate)),
			parseInt(Math.floor(zCandidate))
		)
	);

};

if(module) {

	var MathConsts  = require('../../mathconsts');
	var NoiseGen    = require('../../noisegen');

	module.exports  = Voronoi;

} else {

	require(['noisegen', 'mathconsts']);

}

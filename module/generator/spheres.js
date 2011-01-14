var Spheres = function(frequency) {

	this.frequency = frequency || Spheres.DEFAULT_SPHERES_FREQUENCY;
};

Spheres.DEFAULT_SPHERES_FREQUENCY = 4.0;

Spheres.prototype.getValue = function(x, y, z) {

	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z * this.frequency);

	var distFromCenter          = Math.sqrt(x * x + y * y + z * z);
	var distFromSmallerSphere   = distFromCenter - Math.floor(distFromCenter);
	var distFromLargerSphere    = 1.0 - distFromSmallerSphere;
	var nearestDist             = Math.min(distFromSmallerSphere, distFromLargerSphere);

	return 1.0 - (nearestDist * 4.0); // Puts it in the -1.0 to +1.0 range.

};

if(module) {

	module.exports = Spheres;

}
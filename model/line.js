var Line = function(sourceModule) {

	this.attenuate      = true;
	this.x0             = 0.0;
    this.x1             = 1.0;
	this.y0             = 0.0;
	this.y1             = 1.0;
	this.z0             = 0.0;
	this.z1             = 1.0;
	this.sourceModule   = sourceModule || null;

};

Line.prototype.getValue = function(p) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing module!');

	}

    var value = this.sourceModule.getValue(
	    (this.x1 - this.x0) * p + this.x0,
	    (this.y1 - this.y0) * p + this.y0,
	    (this.z1 - this.z0) * p + this.z0
	);

	return this.attenuate ? (p * (1.0 - p) * 4 * value) : value;

};

if(module) {

	module.exports = Line;

}
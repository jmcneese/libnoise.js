var ScaleBias = function(b, s) {

	this.bias   = b || ScaleBias.DEFAULT_BIAS;
	this.scale  = s || ScaleBias.DEFAULT_SCALE;
};

ScaleBias.DEFAULT_BIAS  = 0.0;
ScaleBias.DEFAULT_SCALE = 1.0;

ScaleBias.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModule.getValue(x, y, z) * this.scale + this.bias;

};

module.exports = ScaleBias;
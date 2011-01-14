var TranslatePoint = function(sourceModule, translateX, translateY, translateZ) {

	this.sourceModule   = sourceModule  || null;
	this.translateX     = translateX    || 0;
	this.translateY     = translateY    || 0;
	this.translateZ     = translateZ    || 0;

};

TranslatePoint.prototype.setTranslation = function(x, y, z) {

	this.translateX = x;
	this.translateY = y;
	this.translateZ = z;

};

TranslatePoint.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModule.getValue(
		x + this.translateX,
		y + this.translateY,
		z + this.translateZ
	);

};

if(module) {

	module.exports = TranslatePoint;

}
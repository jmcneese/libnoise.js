var RotatePoint = function(sourceModule, xAngle, yAngle, zAngle) {

	this.x1matrix       = null;
	this.x2matrix       = null;
	this.x3matrix       = null;
	this.y1matrix       = null;
	this.y2matrix       = null;
	this.y3matrix       = null;
	this.z1matrix       = null;
	this.z2matrix       = null;
	this.z3matrix       = null;
	this.sourceModule   = sourceModule  || null;
	this.xAngle         = xAngle        || RotatePoint.DEFAULT_ROTATE_X;
	this.yAngle         = yAngle        || RotatePoint.DEFAULT_ROTATE_Y;
	this.zAngle         = zAngle        || RotatePoint.DEFAULT_ROTATE_Z;

	this.calcMatrices();

};

RotatePoint.DEFAULT_ROTATE_X = 0.0;
RotatePoint.DEFAULT_ROTATE_Y = 0.0;
RotatePoint.DEFAULT_ROTATE_Z = 0.0;

RotatePoint.prototype = {

	get xAngle() {

		return this._xAngle;

	},

	set xAngle(v) {

		this._xAngle = parseFloat(v);

		this.calcMatrices();

	},

	get yAngle() {

		return this._yAngle;

	},

	set yAngle(v) {

		this._yAngle = parseFloat(v);

		this.calcMatrices();

	},

	get zAngle() {

		return this._zAngle;

	},

	set zAngle(v) {

		this._zAngle = parseFloat(v);

		this.calcMatrices();

	},

	calcMatrices: function() {

		var xCos = Math.cos(this.xAngle * MathConsts.DEG_TO_RAD);
		var yCos = Math.cos(this.yAngle * MathConsts.DEG_TO_RAD);
		var zCos = Math.cos(this.zAngle * MathConsts.DEG_TO_RAD);
		var xSin = Math.sin(this.xAngle * MathConsts.DEG_TO_RAD);
		var ySin = Math.sin(this.yAngle * MathConsts.DEG_TO_RAD);
		var zSin = Math.sin(this.zAngle * MathConsts.DEG_TO_RAD);

		this.x1matrix = ySin * xSin * zSin + yCos * zCos;
		this.y1matrix = xCos * zSin;
		this.z1matrix = ySin * zCos - yCos * xSin * zSin;
		this.x2matrix = ySin * xSin * zCos - yCos * zSin;
		this.y2matrix = xCos * zCos;
		this.z2matrix = -yCos * xSin * zCos - ySin * zSin;
		this.x3matrix = -ySin * xCos;
		this.y3matrix = xSin;
		this.z3matrix = yCos * xCos;

	},

	getValue: function(x, y, z) {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing source module!');

		}

		return this.sourceModule.getValue(
			(this.x1matrix * x) + (this.y1matrix * y) + (this.z1matrix * z),
			(this.x2matrix * x) + (this.y2matrix * y) + (this.z2matrix * z),
			(this.x3matrix * x) + (this.y3matrix * y) + (this.z3matrix * z)
		);

	},

	setAngles: function(xAngle, yAngle, zAngle) {

		this.xAngle = xAngle;
		this.yAngle = yAngle;
		this.zAngle = zAngle;
	}

};

if(module) {

	var MathConsts = require('../../mathconsts');

	module.exports = RotatePoint;

} else {

	require('mathconsts');

}
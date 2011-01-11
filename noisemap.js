var NoiseMap = function(w, h) {

	this.border = 0.0;
	this.width  = w || 1;
	this.height = h || 1;
	this.map    = [];

};

NoiseMap.RASTER_MAX_WIDTH       = 32767;
NoiseMap.RASTER_MAX_HEIGHT      = 32767;
NoiseMap.RASTER_STRIDE_BOUNDARY = 4;

NoiseMap.prototype = {

	get height() {

		return this._height;

	},

	set height(v) {

		if(v < 0) {

			throw new Error('Height must be greater than zero.');

		}

		if(v > NoiseMap.RASTER_MAX_WIDTH) {

			throw new Error('Height cannot exceed max raster height (' + NoiseMap.RASTER_MAX_HEIGHT + ').');

		}

		this._height = v;

	},

	get width() {

		return this._width;

	},

	set width(v) {

		if(v < 0) {

			throw new Error('Width must be greater than zero.');

		}

		if(v > NoiseMap.RASTER_MAX_WIDTH) {

			throw new Error('Width cannot exceed max raster width (' + NoiseMap.RASTER_MAX_WIDTH + ').');

		}

		this._width = v;

	},

	addValue: function(x, y, v) {

		this.setValue(x, y, this.getValue(x, y) + v);

	},

	getValue: function(x, y) {

		return this.map[y * this.width + x];

	},

	setSize: function(w, h) {

		this.width  = w;
		this.height = h;

	},

	setValue: function(x, y, v) {

		this.map[y * this.width + x] = v;

	},

	subtractValue: function(x, y, v) {

		this.setValue(x, y, this.getValue(x, y) - v);

	}

};


if(module) {

	module.exports = NoiseMap;

} else {

	exports = NoiseMap;

}
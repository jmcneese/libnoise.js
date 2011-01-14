var NoiseMap = function(w, h) {

	this.width  = w || 1;
	this.height = h || 1;
	this.map    = [];

};

NoiseMap.prototype = {

	get height() {

		return this._height;

	},

	set height(v) {

		if(v < 0) {

			throw new Error('Height must be greater than zero.');

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

		this._width = v;

	},

	addValue: function(x, y, v) {

		var value = this.getValue(x, y) || 0;

		this.setValue(x, y, value + v);

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

		var value = this.getValue(x, y) || 0;

		this.setValue(x, y,  value - v);

	}

};


if(module) {

	module.exports = NoiseMap;

}
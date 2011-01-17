var Misc = {

	clampValue: function(value, lowerBound, upperBound) {

		if (value < lowerBound) {

			return lowerBound;

		} else if (value > upperBound) {

			return upperBound;

		} else {

			return value;

		}

	},

	exponentFilter: function(value, cover, sharpness) {

		var c = value - (255 - cover);

		if(c < 0) {

			c = 0;

		}

		return 255 - Math.floor(Math.pow(sharpness, c) * 255);


	},

	normalizeValue: function(value, lowerBound, upperBound) {

		return parseFloat(value - lowerBound) / parseFloat(upperBound - lowerBound);

	},

	swapValues: function(a, b) {

		if(typeof a == 'object') {

			b = a[1];
			a = a[0];

		}

		return [b, a];

    }

};

if(module) {

	module.exports = Misc;

}
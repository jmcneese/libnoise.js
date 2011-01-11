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

	swapValues: function(a, b) {

		if(typeof a == 'object') {

			b = a[1];
			a = a[0];

		}

		return [b, a];

    }

};

module.exports = Misc;
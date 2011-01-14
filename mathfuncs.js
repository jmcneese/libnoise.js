var MathFuncs = {

	makeInt32Range: function(n) {

		n = parseFloat(n);

		if (n >= 1073741824.0) {

		  return (2.0 * (n % 1073741824.0)) - 1073741824.0;

		} else if (n <= -1073741824.0) {

		  return (2.0 * (n % 1073741824.0)) + 1073741824.0;

		}

		return n;

	}

};

if(module) {

	module.exports = MathFuncs;

}
var Interpolation = {

	/// Performs cubic interpolation between two values bound between two other
	/// values.
	///
	/// @param n0 The value before the first value.
	/// @param n1 The first value.
	/// @param n2 The second value.
	/// @param n3 The value after the second value.
	/// @param a The alpha value.
	///
	/// @returns The interpolated value.
	///
	/// The alpha value should range from 0.0 to 1.0.  If the alpha value is
	/// 0.0, this function returns @a n1.  If the alpha value is 1.0, this
	/// function returns @a n2.
	cubic: function(n0, n1, n2, n3, a) {
		var p = parseFloat((n3 - n2) - (n0 - n1));
		var q = parseFloat((n0 - n1) - p);
		var r = parseFloat(n2 - n0);
		var s = parseFloat(n1);
		return parseFloat(p * a * a * a + q * a * a + r * a + s);
	},

	/// Performs linear interpolation between two values.
	///
	/// @param n0 The first value.
	/// @param n1 The second value.
	/// @param a The alpha value.
	///
	/// @returns The interpolated value.
	///
	/// The alpha value should range from 0.0 to 1.0.  If the alpha value is
	/// 0.0, this function returns @a n0.  If the alpha value is 1.0, this
	/// function returns @a n1.
	linear: function(n0, n1, a) {
		a = parseFloat(a);
		return parseFloat((1.0 - a) * parseFloat(n0)) + (a * parseFloat(n1));
	},

	/// Maps a value onto a cubic S-curve.
	///
	/// @param a The value to map onto a cubic S-curve.
	///
	/// @returns The mapped value.
	///
	/// @a a should range from 0.0 to 1.0.
	///
	/// The derivitive of a cubic S-curve is zero at @a a = 0.0 and @a a =
	/// 1.0
	cubicSCurve: function(a) {
		a = parseFloat(a);
		return (a * a * (3.0 - 2.0 * a));
	},

	/// Maps a value onto a quintic S-curve.
	///
	/// @param a The value to map onto a quintic S-curve.
	///
	/// @returns The mapped value.
	///
	/// @a a should range from 0.0 to 1.0.
	///
	/// The first derivitive of a quintic S-curve is zero at @a a = 0.0 and
	/// @a a = 1.0
	///
	/// The second derivitive of a quintic S-curve is zero at @a a = 0.0 and
	/// @a a = 1.0
	quinticSCurve: function(a) {
		a = parseFloat(a);
		var a3 = parseFloat(a * a * a);
		var a4 = parseFloat(a3 * a);
		var a5 = parseFloat(a4 * a);
		return parseFloat((6.0 * a5) - (15.0 * a4) + (10.0 * a3));
	}

};

if(module) {

	module.exports = Interpolation;

}
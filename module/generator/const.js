var Const = function(v) {

	this.value = v || Const.DEFAULT_CONST_VALUE;

};

Const.DEFAULT_CONST_VALUE = 0.0;

Const.prototype.getValue = function() {

	return this.value;

};

if(module) {

	module.exports = Const;

}
export default class Uppercase {
	constructor(str) {
		this._str = str.toUpperCase();
	}

	getUppercase() {
		return this._str;
	}
}
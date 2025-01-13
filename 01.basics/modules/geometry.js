/**
 * Doo all things geometry-related
 *
 * SUCH FUN!
 */

/**
 * Return the area of a square
 */
const areaOfSquare = (w, h) => {
	return w * h;
}

/**
 * Return the circumference of a circle
 */
const circumferenceOfCircle = (r) => {
	return 2 * Math.PI * r;
}

/**
 * Return the circumference of a square
 */
const circumferenceOfSquare = (w, h) => {
	return w * 2 + h * 2;
}

// Export all the stuff
module.exports = {
	areaOfCircle: r => Math.PI * r ** 2,  // okey-ish but better to create it with a docblock for documentation
	areaOfSquare,
	circumferenceOfCircle,
	circumferenceOfSquare,
}
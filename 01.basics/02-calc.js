/**
 * Calc 🧮
 */
//hämtar ut de variablarna vi skapat i geometry
const geometry = require("./modules/geometry");

console.log("A random number:", Math.random());

//genom att säga geometry.areOfSquare så går vi in i geometry som jämtar ut export från geometry.js, sedan tar vi ut variabeln areOfSquare
console.log("Area of 2x4 box:", geometry.areaOfSquare(2, 4));
console.log("Circumference of 2x4 box:", geometry.circumferenceOfSquare(2, 4));

console.log("Area of a circle with radius 10:", geometry.areaOfCircle(10));
console.log("Circumference of a circle with radius 10:", geometry.circumferenceOfCircle(10));
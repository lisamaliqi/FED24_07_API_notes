/**
 * Globals
 */

//logga ut det i terminalen genom att skriva node global i terminalen 
console.log("Hello backend from 01-globals.js");

//skapa en timeout som också funkar i terminalen som det gör i browser
setTimeout(() => {
	console.log("Timeout of 3 sek is done!");
    //int kommer köra tills vi avlutar int i denna timeouten
    clearInterval(int)
}, 3000);


//kommer köras var 0,5 sek tills timeout är slut. Om man ej hade timeout behöver man avsluta hela terminalen med control + c 
const int = setInterval(() => {
	console.log("Hello?");
}, 500);

console.log("Cheerio!");

console.log("Absolute path to directory for this file:", __dirname);
console.log("Absolute path to this file:", __filename);


console.log("Such reload");
console.log("Very fast");
console.log("Much wow!"); 


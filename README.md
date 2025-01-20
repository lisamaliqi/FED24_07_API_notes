# FED24 API-utveckling

All källkod för kursen API-utveckling för klassen FED24 i Malmö.

## Källkod

Varje lektion är en egen, fristående branch och innehåller samtlig källkod från föregående branches.

## Branches

Hämta ut den branch du är intresserad av, gå in i exemplet du vill köra i en terminal och skriv `npm install`. Därefter kan du köra källkoden genom att skriva `node <filnamn>` eller `nodemon <filnamn>`.

Vi kommer även i senare branches att sätta upp scripts i `package.json` så du kan därefter köra `npm run dev` för att starta en development-server med debug-logging aktiverat.

### Exempel

```zsh
git pull
git checkout lesson-1
cd 01-basics
npm install
node index.js
```

osv.



### Install 
du kan inställera nodemon för en bättre "upplevelse", skriv 
$ npm install nodemon --save-dev 
i mappen du befinner dig i, ex 01.basics
Detta är ifall du vill att terminalen ska uppdateras varje gång du sparar din fil, men det finns ett lättare sätt som är inbyggt 
skriv istället 
node --watch global.js  
(namnet på huvudfilen) så kommer det uppdateras automatiskt varje gång

Installera express: 
börja med att ställa dig i den mappen du vill skapa express i, sedan skriver du: 
$ npm init 
efter det så kommer du få svara på massor av frågor där du bara kan trycka return FÖRUTOM när det står:
entry point: (index.js)
här ska du istället för att trycka return skriva namnet på vad du vill att "huvudfilen" för js ska heta, ex:
entry point: (index.js) server.js
efter detta kör du:
$ npm install express
Allt klart!


Installera morgan: 
Samma som express, skriv
$ npm init
sedan skriver du
$ npm install morgan 
Klart!
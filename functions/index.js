const functions = require("firebase-functions");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/mutant/', function(solicitud, resultado){

	var cadena = solicitud.body.adn;
	var totalcadena = 0;
    for (var i = 0; i < cadena.length; i++) {
        for (var j = 0; j < cadena[i].length; j++) {
            if (j < cadena[i].length - 3) {
                if (cadena[i][j] == cadena[i][j + 1] && cadena[i][j + 1] == cadena[i][j + 2] && cadena[i][j + 2] == cadena[i][j + 3]) {
                	//console.log("Horizontal")
                    totalcadena++;
                }
            }
            if (i < cadena.length - 3) {
                if (cadena[i][j] == cadena[i + 1][j] && cadena[i + 1][j] == cadena[i + 2][j] && cadena[i + 2][j] == cadena[i + 3][j]) {
                	//console.log("Vertical")
                    totalcadena++;
                }
            }
            if (i < cadena.length - 3 && j < cadena[i].length - 3) {
                if (cadena[i][j] == cadena[i + 1][j + 1] && cadena[i + 1][j + 1] == cadena[i + 2][j + 2] && cadena[i + 2][j + 2] == cadena[i + 3][j + 3]) {
                	//console.log("Diagonal")
                    totalcadena++;
                }
            }
            if (i >= 3 && j < cadena[i].length - 3) {
                if (cadena[i][j] == cadena[i - 1][j + 1] && cadena[i - 1][j + 1] ==  cadena[i - 2][j + 2] &&  cadena[i - 2][j + 2] == cadena[i - 3][j + 3]) {
                	//console.log("Diagonal Invertido")
                    totalcadena++;
                }
            }
            //console.log(totalcadena);
            if (totalcadena > 0) {
            	resultado.sendStatus(200);
                //resultado.send(true);
                
            }
        }
    }
    resultado.sendStatus(403);
    //resultado.send(false);
	
});


exports.app = functions.https.onRequest(app);

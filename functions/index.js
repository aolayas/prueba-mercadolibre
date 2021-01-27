const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
admin.initializeApp();
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
            
            
        }
        if( (i + 1) == cadena.length && j == cadena.length ){
            
            // FInalizó la validación
            if (totalcadena > 0) {
                admin.firestore().collection('mutantes').add({
                    adn: cadena,
                    mutante: true
                }).then(writeResult => {});
                
                resultado.sendStatus(200);
            }else{
                admin.firestore().collection('mutantes').add({
                    adn: cadena,
                    mutante: false
                }).then(writeResult => {}); 
                resultado.sendStatus(403);
            }

        }
    }
});

app.post("/stats", function(sol, res){
    var totalHumanos = 0;
    var totalMutantes = 0;
    admin.firestore().collection('mutantes').get().then((respuestaDB) => {
        respuestaDB.forEach((temp) => {
            console.log(temp.data().mutante);
            if (temp.data().mutante) {
                totalMutantes++;
            } else {
                totalHumanos++;
            }
        });
        console.log(totalHumanos);
        console.log(totalMutantes);
        var respuesta =  {
            "count_mutant_dna":totalMutantes, 
            "count_human_dna":totalHumanos,
            "ratio":totalMutantes/totalHumanos
        } 
        res.status(200).send(respuesta);
    });
    
});

exports.app = functions.https.onRequest(app);

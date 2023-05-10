import express from "express"; //dependencias npm instaladas, no requieren extension
import dotenv from "dotenv";
import cors from 'cors'; //cors es una forma de proteger tu api 
import conectarDB from "./config/db.js"; //cuando yo las creo si
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //el orgine del req. está permitido
            callback(null, true);
        }else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions)); //utilizando cors

app.use("/api/veterinarios", veterinarioRoutes); //cunado llamemos a esta url nos llevara a este archivo de router
app.use("/api/pacientes", pacienteRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Funcionando en el puerto ${port}`);
});
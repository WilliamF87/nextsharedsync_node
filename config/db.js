import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: 'variables.env' });

const connectWithRetry = async () => {
    const user = process.env.USER;
    const password = process.env.PASSWORD;
    const db = process.env.DB;

    try {
        // Solo es necesario en versiones anteriores a mongoose v7
        await mongoose.set('strictQuery', true);

        await mongoose.connect(
            `mongodb+srv://${user}:${password}@cluster0.huenyqh.mongodb.net/${db}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        // console.log("DB conectada");
    } catch (error) {
        throw error;
    }
};

const conectarDB = async () => {
    try {
        let reconnecting = true;

        while (reconnecting) {
            try {
                await connectWithRetry();
                console.log('Conexión exitosa a MongoDB Atlas');
                reconnecting = false;  // Dejar de reconectar si la conexión es exitosa
            } catch (error) {
                console.log('Desconectado de MongoDB Atlas. Intentando reconectar...');
                await new Promise(resolve => setTimeout(resolve, 5000));  // Esperar 5 segundos antes de intentar reconectar
            }
        }
    } catch (error) {
        console.log("Hubo un error");
        console.log(error);

        // Detener servidor
        // process.exit(1);
    }

}

export default conectarDB;

// Cuando en strict la opción se establece en true , Mongoose se asegurará de que solo los campos que se especifican en su esquema se guarden en la base de datos, y todos los demás campos no se guardarán (si se envían otros campos).

// En este momento, esta opción está habilitada de forma predeterminada, pero se cambiará en Mongoose v7 a false de forma predeterminada. Eso significa que todos los campos se guardarán en la base de datos, incluso si algunos de ellos no están especificados en el modelo de esquema.

// Por lo tanto, si desea tener esquemas estrictos y almacenar en la base de datos solo lo que se especifica en su modelo, comenzando con Mongoose v7, deberá establecer la strictopción en verdadero manualmente.
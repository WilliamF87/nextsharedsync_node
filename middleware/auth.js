import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
    // Obtener el Authorization (Bearer Token)
    const authHeader = req.get('Authorization');
    
    // Comprobar si el Token es válido
    if(authHeader) {
        // Obtener el Token
        const token = authHeader.split(' ')[1];

        try {
            // Comprobar el Jwt (debe usar la misma llave usada para firmarlo)
            const usuario = jwt.verify(token, process.env.CLAVE_SECRETA);
            req.usuario = usuario;

            // return next();
        } catch (error) {
            console.log(error);
            // return res.status(404).json({ msg: error.message});
        }

    }
    return next();

    // if(!authHeader) {
    //     const error = new Error("Token no válido");
    //     return res.status(401).json({ msg: error.message });
    // }

}

export default checkAuth;
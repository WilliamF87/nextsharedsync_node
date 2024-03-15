import nodemailer from "nodemailer";

export const emailRegistro = async datos => {
    
    const { email, nombre, token } = datos;

    // Documentación y dependencias: https://nodemailer.com/ y https://mailtrap.io/
    const transport = nodemailer.createTransport({
        // host: "smtp.mailtrap.io",
        // port: 2525,
        // auth: {
        //   user: "26e52b71c824dc",
        //   pass: "0075225c581dc2"
        // }
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Información del Email
    await transport.sendMail({
        from: '"NextSharedSync - Administrador de Archivos" <cuentas@nextsharedsync.com>',
        to: email,
        subject:"NextSharedSync - Confirma tu cuenta",
        text: "Confirma tu cuenta en NextSharedSync",
        html:`<p>Hola: ${nombre}, comprueba tu cuenta en NextSharedSync</p>
        <p>Tu cuenta ya está casi lista, solo debes confirmarla para empezar a usarla. Para hacerlo, copia y pega el siguiente enlace en tu navegador:</p>
        
        <p style="color: blue;">${process.env.FRONTEND_URL}/confirmar/${token}</p>

        <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje</p>`,
    });
};

export const emailOlvidePassword = async datos => {
    
    const { email, nombre, token } = datos;

    // Documentación y dependencias: https://nodemailer.com/ y https://mailtrap.io/
    // TODO: Marcar comentarios importantes con extensión Better Comments
    const transport = nodemailer.createTransport({
        // host: "smtp.mailtrap.io",
        // port: 2525,
        // auth: {
        //   user: "26e52b71c824dc",
        //   pass: "0075225c581dc2"
        // }
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    // Información del Email
    const info = await transport.sendMail({
        from: 'NextSharedSync - Administrador de Archivos" <cuentas@nextsharedsync.com>',
        to: email,
        subject:"NextSharedSync - Reestablece tu Password",
        text: "Reestablece tu Password",
        html:`<p>Hola: ${nombre}, has solicitado reestablecer tu password. Para hacerlo, copia y pega el siguiente enlace en tu navegador:</p>

        <p style="color: blue;">${process.env.FRONTEND_URL}/olvide_password/${token}</p>

        <p>Si tú no solicitaste este email, puedes ignorar el mensaje</p>`,
    });
};
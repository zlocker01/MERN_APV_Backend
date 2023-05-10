import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const {email, nombre, token } = datos;

    //enviar emial al veterinario
    const info = await transporter.sendMail({
        from: 'APV_ Administrador de Pacientes Veterinaria',
        to: email,
        subject: 'Recupera tu cuenta en APV',
        text: 'Restablece tu password',
        html: `<p>Bienvenido ${nombre}, has solicitado reestablecer tu password.</p>
        <p>Por favor accede al sigueinte enlace para generar un nuevo password: <a href=${process.env.FRONTEND_URL}/olvide-password/${token}>Reestablecer Password</a></p>
        <p>Si tú no creaste esta cuenta puedes ignorar este mensaje</p>`
    });
    console.log('Mensaje enviado, %s', info.messageId);
};

export default emailOlvidePassword;
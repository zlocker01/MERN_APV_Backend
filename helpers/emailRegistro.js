import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
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
        subject: 'Comprubea tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `<p>Bienvenido ${nombre}, solo falta comprobar tu cuenta para puedas empezar a registrar pacientes en APV.</p>
        <p>Por favor accede al sigueinte enlace: <a href=${process.env.FRONTEND_URL}/confirmar/${token}>Comprobar Cuenta</a></p>
        <p>Si tú no creaste esta cuenta puedes ignorar este mensaje</p>`
    });
    console.log('Mensaje enviado, %s', info.messageId);
};

export default emailRegistro;
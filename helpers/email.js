import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
    const { email, name, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    // Email information
    const info = await transport.sendMail({
        from: '"Occasio - Administrador de Eventos" <cuentas@occasio.com>',
        to: email,
        subject: "Occasio - Confirma Tu Cuenta",
        text: "Comprueba tu cuenta en Occasio",
        html: `
            <p>Hola: ${name}. Comprueba tu cuenta en Occasio</p>
            
            <p>
                Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace: ${""}
                <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirmar Cuenta</a>
            </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });
}

export const emailForgotPassword = async (data) => {
    const { email, name, token } = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    
    // Email information
    const info = await transport.sendMail({
        from: '"Occasio - Administrador de Proyectos" <cuentas@occasio.com>',
        to: email,
        subject: "Occasio - Restablece tu Password",
        text: "Restablece tu Password",
        html: `
            <p>Hola: ${name}. Has solicitado reestablecer tu password</p>
            
            <p>
                Sigue el siguiente password para generar un nuevo password: ${""}
                <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reestablecer Contraseña</a>
            </p>

            <p>Si tu no solicitaste este email, puedes ignorar este mensaje</p>
        `
    });
}
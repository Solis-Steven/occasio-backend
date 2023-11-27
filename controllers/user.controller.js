import UserModel from "../models/User.model.js";
import idGenerator from "../helpers/idGenerator.js";
import JWTGenerator from "../helpers/JWTGenerator.js";
import { emailForgotPassword, emailRegister } from "../helpers/email.js";

// This function take an user object and creates new user
export const createUser = async(req, res) => {
    const { email } = req.body;

    const existingUser = await UserModel.findOne({email});

    if(existingUser) {
        const error = new Error("Usuario ya registrado");

        return(res.status(400).json({msg: error.message}));
    }
    
    try {
        const user = new UserModel(req.body);
        user.token = idGenerator();
        user.save();

        emailRegister({
            email: user.email,
            name: user.name,
            token: user.token
        });

        res.json({msg: "Usuario creado correctamente. Revisa tu email para confirmar tu cuenta"});
    } catch (error) {
        console.log("Create user error", error);
    }
}

// This function verify the user account to allow access
export const authenticate = async(req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({email});

    if(!user) {
        const error = new Error("El usuario no existe");

        return(res.status(404).json({msg: error.message}));
    }

    if(!user.confirmed) {
        const error = new Error("Tu cuenta no ha sido confirmada");

        return(res.status(403).json({msg: error.message}));
    }

    if(await user.verifyPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email,
            token: JWTGenerator(user._id)
        })
    } else {
        const error = new Error("La contraseña ingresada es incorrecta");

        return(res.status(403).json({msg: error.message}));
    }
}

// This function confirms user accoutn
export const confirm = async(req, res) => {
    const { token } =  req.params;

    const confirmedUser = await UserModel.findOne({token});

    if(!confirmedUser) {
        const error = new Error("Token no válido");

        return(res.status(404).json({msg: error.message}));
    }

    try {
        confirmedUser.confirmed = true;
        confirmedUser.token = "";
        await confirmedUser.save();

        res.json({msg: "Usuario confirmado correctamente"});
    } catch (error) {
        console.log("Confirm error: ", error);
    }
}

/* This function generates a token so that the user
can change his password */
export const forgotPassword = async(req, res) => {
    const { email } = req.body;

    const user = await UserModel.findOne({email});

    if(!user) {
        const error = new Error("El usuario no existe");

        return(res.status(404).json({msg: error.message}));
    }

    try {
        user.token = idGenerator();
        await user.save();

        emailForgotPassword({
            email: user.email,
            name: user.name,
            token: user.token
        });

        res.json({msg: "Te hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log("Forgot password error: ", error);
    }
}

// This function verify if the token exists
export const checkToken = async(req, res) => {
    const { token } = req.params;

    const validToken = await UserModel.findOne({token});

    if(!validToken) {
        const error = new Error("El token no es válido");

        return(res.status(404).json({msg: error.message}));
    }

    res.json({msg: "Token válido y el usuario existe"});
}

// This function saves the new user password
export const newPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await UserModel.findOne({token});

    if(!user) {
        const error = new Error("El token no es válido");

        return(res.status(404).json({msg: error.message}));
    }

    try {
        user.password = password;
        user.token = "";
        await user.save();

        res.json({msg: "Contraseña modificada correctamente"});
    } catch (error) {
        console.log("New Password error: ", error);
    }
}


// Return user
export const profile = async(req, res) => {
    const { user } = req;

    res.json(user);
}
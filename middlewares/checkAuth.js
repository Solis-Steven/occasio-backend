import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";

const checkAuth = async(req, res, next) => {
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);

        req.user = await UserModel.findById(decoded.id)
        .select("-password -confirmed -token -createdAt -updatedAt -__v");

        return(next());
    }

    if(!token) {
        const error = new Error("Token no válido");

        return(res.status(401).json({msg: error.message}));
    }

    next();
}

export default checkAuth;
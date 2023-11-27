import express from "express";
import { 
    createUser,
    authenticate,
    confirm,
    forgotPassword,
    checkToken,
    newPassword,
    profile
} from "../controllers/user.controller.js";
import checkAuth from "../middlewares/checkAuth.js"

const router = express.Router();

router.post("/", createUser);
router.post("/login", authenticate);
router.get("/confirm/:token", confirm);
router.post("/forgot-password", forgotPassword); 
router.route("/forgot-password/:token")
    .get(checkToken)
    .post(newPassword);
router.get("/profile", checkAuth, profile);

export default router;
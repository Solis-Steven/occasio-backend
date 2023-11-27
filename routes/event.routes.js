import express from "express";
import {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent
} from "../controllers/event.controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.route("/")
    .get(checkAuth, getEvents)
    .post(checkAuth, createEvent);
router.route("/:id")
    .get(checkAuth, getEvent)
    .put(checkAuth, updateEvent)
    .delete(checkAuth, deleteEvent);

export default router;
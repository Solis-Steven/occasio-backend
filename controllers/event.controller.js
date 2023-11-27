import EventModel from "../models/Event.model.js";

export const createEvent = async(req, res) => {
    const event = new EventModel(req.body);
    event.creator = req.user._id;

    try {
        const savedEvent = await event.save();
        
        res.json(savedEvent);
    } catch (error) {
        console.log("Create event error: ", error);
    }
}

export const getEvents = async(req, res) => {

    const events = await EventModel.find({
        "$or": [
            {"collaborators": {$in: req.user}},
            {"creator": {$in: req.user}},
        ]
    }).select("-tasks");


    res.json(events)
}

export const getEvent = async(req, res) => {
    const { id } = req.params;

    const event = await EventModel.findById(id);

    if(!event) {
        const error = new Error("El evento no existe");

        return(res.status(404).json({ msg: error.message }));
    }

    res.json(event);
}

export const updateEvent = async(req, res) => {
    const { id } = req.body;

    const event = await EventModel.findById(id);

    if(!event) {
        const error = new Error("El evento no existe");

        return(res.status(404).json({ msg: error.message }));
    }

    if(event.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida");

        return(res.status(403).json({msg: error.message}));
    }

    const { name, description, date, customer } = req.body;

    event.name = name;
    event.description = description;
    event.date = date;
    event.customer = customer;

    try {
        const editedEvent = await event.save();
        res.json(editedEvent);
    } catch (error) {
        console.log("Edite event error", error);
    }

}

export const deleteEvent = async(req, res) => {
    const { id } = req.params;

    const event = await EventModel.findById(id);

    if(!event) {
        const error = new Error("El evento no existe");

        return(res.status(404).json({ msg: error.message }));
    }

    if(event.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Accion no valida");

        return(res.status(403).json({ msg: error.message }));
    }

    try {
        await event.deleteOne();
        
        res.json(event);
    } catch (error) {
        console.log("Delete event error", error);
    }
}
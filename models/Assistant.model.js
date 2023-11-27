import mongoose from "mongoose";

const assistantSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number
    },
    confirmed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Assistant = mongoose.model("Assistant", assistantSchema);
export default Assistant;
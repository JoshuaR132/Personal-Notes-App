import mongoose from "mongoose";

const noteShema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
},    { timestamps: true});

export default mongoose.model("Note", noteSchema);
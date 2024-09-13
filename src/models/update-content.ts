import {UpdateView} from "./update-view"
import {prop, modelOptions, getModelForClass} from "@typegoose/typegoose";
import type {model} from "../types";
import type {ObjectId} from "mongodb";

@modelOptions({
    schemaOptions: {
        timestamps: true,
        strict: true,
    }
})

class UpdateContent {
    @prop({
        required: true,
        type: String,
        trim: true,
    })
    content!: string;

    @prop({
        ref: UpdateView
    })
    viewId!: ObjectId;
}

const Model: model = getModelForClass(UpdateContent);

export {
    UpdateContent,
    Model
}
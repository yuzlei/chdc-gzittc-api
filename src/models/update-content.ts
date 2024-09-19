import {prop, modelOptions, getModelForClass} from "@typegoose/typegoose";
import type {model} from "../types";
import type {ObjectId} from "mongodb";


@modelOptions({
    schemaOptions: {
        timestamps: true,
        strict: true,
    },
    options: {
        customName: 'update_contents'
    }
})

class UpdateContent {
    @prop({
        required: false,
        type: String,
        trim: true,
        default: "",
    })
    content!: string;

    @prop({
        required: false,
        type: String,
        trim: true,
        default: "",
    })
    content_text!: string;

    @prop({ref: "update_views"})
    viewId!: ObjectId;
}

const Model: model = getModelForClass(UpdateContent);

export {
    UpdateContent,
    Model
}
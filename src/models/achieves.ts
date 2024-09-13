import {prop, modelOptions, getModelForClass} from "@typegoose/typegoose";
import type {model} from "../types"

@modelOptions({
    schemaOptions: {
        timestamps: true,
        strict: true,
    }
})

class Achieves {
    @prop({
        required: true,
        type: String,
        trim: true,
    })
    name!: string

    @prop({
        required: true,
        type: String,
        trim: true,
    })
    imgSrc!: string
}

const Model: model = getModelForClass(Achieves);

export {
    Achieves,
    Model
}
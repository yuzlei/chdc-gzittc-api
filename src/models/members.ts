import {prop, modelOptions, getModelForClass} from "@typegoose/typegoose";
import type {model} from "../types"

@modelOptions({
    schemaOptions: {
        timestamps: true,
        strict: true,
    },
})

class Members {
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
    head!: string

    @prop({
        required: true,
        type: [String],
        trim: true,
    })
    status!: string
}

const Model: model = getModelForClass(Members);

export {
    Members,
    Model
}
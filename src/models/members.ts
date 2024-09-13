import type {model} from "../types"
import {prop, modelOptions, getModelForClass} from "@typegoose/typegoose";

enum MemberStatus {
    "站长",
    "社长",
    "成员"
}

@modelOptions({
    schemaOptions: {
        timestamps: true,
        strict: true,
    }
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
        enum: Object.values(MemberStatus),
        trim: true,
    })
    status!: Array<MemberStatus>
}

const Model: model = getModelForClass(Members);

export {
    Members,
    Model
}
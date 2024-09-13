import {Model as ContentModel} from "../models/update-content";
import {prop, modelOptions, getModelForClass, pre} from "@typegoose/typegoose";
import type {model} from "../types"
import type {CallbackWithoutResultAndOptionalError} from "mongoose"

@modelOptions({
    schemaOptions: {
        timestamps: true,
        strict: true,
    }
})

@pre<UpdateView>('save', async function (next: CallbackWithoutResultAndOptionalError): Promise<void> {
    try {
        if (this.isNew) await new ContentModel({...(this as any).content, viewId: this._id}).save();
        next();
    } catch (e: any) {
        next(e)
    }
})

class UpdateView {
    @prop({
        required: true,
        type: String,
        trim: true,
    })
    title!: string

    @prop({
        required: true,
        type: String,
        trim: true,
    })
    ellipsis!: string

    @prop({
        required: true,
        type: String,
        trim: true,
    })
    author!: string

    @prop({
        required: true,
        type: String,
        trim: true,
    })
    cover!: string;
}

const Model: model = getModelForClass(UpdateView);

export {
    UpdateView,
    Model
}
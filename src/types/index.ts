import type {IRouterParamContext} from "koa-router";
import type {ReturnModelType} from "@typegoose/typegoose"
import type {AnyParamConstructor} from "@typegoose/typegoose/lib/types";
import type {ParameterizedContext} from "koa";

type model = ReturnModelType<AnyParamConstructor<any>>

type sort = 'ascending' | 'descending'

type ctx = ParameterizedContext<any, IRouterParamContext, any>

export {
    model,
    ctx,
    sort
}
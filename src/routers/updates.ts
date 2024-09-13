import {Model as ViewModel} from "../models/update-view";
import {Model as ContentModel} from "../models/update-content";
import {getResources, uploadResources} from "../utils";
import {publicPath} from "../config";
import Router from 'koa-router'
import type {ctx} from "../types"

const router: Router = new Router()
const path: string = "/updates"
const pageMaxNum: number = 10

getResources(router, path, ViewModel)
getResources(router, path, ContentModel)
uploadResources(router, path, `${publicPath}/images/head`)

router.delete(path, async (ctx: ctx): Promise<void> => {

})

router.post(`${path}/create`, async (ctx: ctx): Promise<void> => {

})

router.put(`${path}/:id`, async (ctx: ctx): Promise<void> => {

})

export default router

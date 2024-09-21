import {updateResources, uploadResources, deleteResources, getResources, createResources, getPage} from "../utils";
import {Model, Achieves} from "../models/achieves";
import Router from 'koa-router'

const router: Router = new Router()
const path: string = "/achieves"

updateResources(router, path, Model)
uploadResources(router, path, `images/achieve`)
deleteResources(router, path, Model)
getResources(router, path, Model)
createResources(router, path, Model)
getPage(router, path, Model, Achieves)

export default router
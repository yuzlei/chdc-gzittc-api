import Router from 'koa-router'
import {updateResources, uploadResources, deleteResources, getResources, createResources} from "../utils";
import {Model} from "../models/achieves";

const router: Router = new Router()

const path: string = "/achieves"

updateResources(router, path, Model)
uploadResources(router, path, `images/achieve`)
deleteResources(router, path, Model)
getResources(router, path, Model)
createResources(router, path, Model)

export default router
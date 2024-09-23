import {
    updateResources,
    uploadResources,
    deleteResources,
    getResources,
    createResources,
    getPage,
    clearResources
} from "../utils";
import {Model, Achieves} from "../models/achieves";
import {publicPath} from "../config";
import path from "path";
import Router from 'koa-router'

const router: Router = new Router()
const _path: string = "/achieves"

updateResources(router, _path, Model)
deleteResources(router, _path, Model)
getResources(router, _path, Model)
createResources(router, _path, Model)
getPage(router, _path, Model, Achieves)
uploadResources(router, _path, `/images/achieve`)
clearResources(router, _path, path.join(publicPath, "/images/achieve"))

export default router
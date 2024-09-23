import {Model, Members} from "../models/members"
import {
    clearResources,
    createResources,
    deleteResources,
    getPage,
    getResources,
    updateResources,
    uploadResources
} from "../utils"
import {publicPath} from "../config";
import path from "path";
import Router from 'koa-router'

const router: Router = new Router()
const _path: string = "/members"

updateResources(router, _path, Model)
deleteResources(router, _path, Model)
getResources(router, _path, Model)
createResources(router, _path, Model)
getPage(router, _path, Model, Members)
uploadResources(router, _path, `/images/head`)
clearResources(router, _path, path.join(publicPath, "/images/head"))

export default router
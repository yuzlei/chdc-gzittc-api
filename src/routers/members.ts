import {Model} from "../models/members"
import {createResources, deleteResources, getResources, updateResources, uploadResources} from "../utils"
import {publicPath} from "../config";
import Router from 'koa-router'

const router: Router = new Router()

const path: string = "/members"

updateResources(router, path, Model)
uploadResources(router, path, `${publicPath}/images/head`)
deleteResources(router, path, Model)
getResources(router, path, Model)
createResources(router, path, Model)

export default router
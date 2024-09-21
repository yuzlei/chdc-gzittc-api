import {Model, Members} from "../models/members"
import {createResources, deleteResources, getPage, getResources, updateResources, uploadResources} from "../utils"
import Router from 'koa-router'

const router: Router = new Router()

const path: string = "/members"

updateResources(router, path, Model)
uploadResources(router, path, `images/head`)
deleteResources(router, path, Model)
getResources(router, path, Model)
createResources(router, path, Model)
getPage(router, path, Model, Members)

export default router
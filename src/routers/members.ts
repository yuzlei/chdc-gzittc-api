import {Model} from "../models/members"
import {createResources, deleteResources, getResources, updateResources, uploadResources} from "../utils"
import Router from 'koa-router'

const router: Router = new Router()

const path: string = "/member"

updateResources(router, path, Model)
uploadResources(router, path, `images/head`)
deleteResources(router, path, Model)
getResources(router, path, Model)
createResources(router, path, Model)

export default router
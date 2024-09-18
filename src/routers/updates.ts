import {Model as ViewModel, UpdateView} from "../models/update-view";
import {Model as ContentModel, UpdateContent} from "../models/update-content";
import {getResources, uploadResources, getFilter} from "../utils";
import Router from 'koa-router'
import type {ctx} from "../types"
import type {ParsedUrlQuery} from 'querystring'
import type {PipelineStage} from "mongoose"

const router: Router = new Router()
const path: string = "/updates"

type sort = 'ascending' | 'descending'

getResources(router, `${path}/contents`, ContentModel)
uploadResources(router, path, `images/head`)

const inKey = (object: Record<string, any>, inObject: Record<string, any>, prefix: string = ""): Record<string, any> => {
    let obj: Record<string, any> = {}
    for (const key in object) {
        if (inObject.hasOwnProperty(key)) obj[`${prefix}${key}`] = object[key]
    }
    return obj
}

const FillingAnObject = (object: Record<string, any>, prefix: string = "") => {
    let obj: Record<string, any> = {}
    for (const key in object) {
        obj[key] = `${prefix}${key}`
    }
    return obj
}

router.get(`${path}/pages`, async (ctx: ctx): Promise<void> => {
    try {
        const query: ParsedUrlQuery & {
            sort: sort,
            sortName: string,
            limit: number,
            page: number,
        } = ctx.query as ParsedUrlQuery & {
            sort: sort,
            sortName: string,
            limit: number,
            page: number,
        }

        const sort: sort = query.sort
        const sortName: string = query.sortName
        const limit: number = query.limit || 10
        const page: number = query.page || 1

        const as: string = 'update_views'

        const viewMatch: Record<string, any> = inKey(getFilter(query, ctx), new UpdateView(), `${as}.`)
        const contentMatch: Record<string, any> = inKey(getFilter(query, ctx), new UpdateContent())
        const viewResult: Record<string, any> = FillingAnObject(new UpdateView(), `$${as}.`)

        const pipeline: Array<PipelineStage> = [
            {
                $lookup: {
                    from: as,
                    localField: 'viewId',
                    foreignField: '_id',
                    as
                }
            },
            {
                $unwind: `$${as}`
            }, {
                $match: {...viewMatch, ...contentMatch}
            }
        ]

        if (sortName && sort) {
            pipeline.push({
                $sort: {
                    [sortName]: sort === 'ascending' ? 1 : -1
                }
            })
        }

        pipeline.push({
            $project: {_id: 1, createdAt: 1, updatedAt: 1, ...viewResult}
        }, {
            $skip: (page - 1) * limit
        }, {
            $limit: limit
        })
        ctx.body = await ContentModel.aggregate(pipeline)
    } catch (e) {
        ctx.throw(400, '查找数据失败');
    }
});

router.delete(`${path}/delete`, async (ctx: ctx): Promise<void> => {
    try {
        const ids: Array<string> | undefined = (ctx.request.body as { ids: Array<string> } | undefined)?.ids
        if (Array.isArray(ids) && ids.length > 0) {
            await ContentModel.deleteMany({viewId: {$in: ids}})
            await ViewModel.deleteMany({_id: {$in: ids}})
            ctx.status = 200;
            ctx.body = {message: '删除数据成功'};
        } else {
            ctx.throw(400, '请提供一个有效的id列表');
        }
    } catch (e) {
        ctx.throw(400, '删除数据失败');
    }
})

router.post(`${path}/create`, async (ctx: ctx): Promise<void> => {
    try {
        const data = ctx.request.body
        if (data) {
            await new ViewModel({...data}).save()
            ctx.status = 200;
            ctx.body = {message: '添加数据成功'};
        } else {
            ctx.throw(400, '添加数据失败');
        }
    } catch (e) {
        ctx.throw(400, '添加数据失败');
    }
})

router.put(`${path}/:id`, async (ctx: ctx): Promise<void> => {
    try {
        const id: string = ctx.params.id
        const data = ctx.request.body
        if (data) {
            const viewMatch: Record<string, any> = inKey(data, new UpdateView())
            const contentMatch: Record<string, any> = inKey(data, new UpdateContent())

            contentMatch.toString() !== "{}" ? await ContentModel.updateOne({viewId: id}, {$set: contentMatch}) : null
            viewMatch.toString() !== "{}" ? await ViewModel.updateOne({_id: id}, {$set: viewMatch}) : null
            ctx.status = 200;
            ctx.body = {message: '更新数据成功'};
        } else {
            ctx.throw(400, '更新数据失败');
        }
    } catch (e) {
        ctx.throw(400, '更新数据失败');
    }
})

export default router

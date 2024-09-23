import {ObjectId} from "mongodb";
import {publicPath} from "../config";
import {uploadResources, getFilter, inKey, clearResources} from "../utils";
import {Model as ViewModel, UpdateView} from "../models/update-view";
import {Model as ContentModel, UpdateContent} from "../models/update-content";
import path from "path";
import Router from 'koa-router'
import type {ctx, sort} from "../types"
import type {ParsedUrlQuery} from 'querystring'
import type {PipelineStage} from "mongoose"

const router: Router = new Router()
const _path: string = "/updates"

uploadResources(router, _path, `/images/update`)
clearResources(router, _path, path.join(publicPath, "/images/update"))

const FillingAnObject = (object: Record<string, any>, prefix: string | null = null) => {
    let obj: Record<string, any> = {}
    for (const key in object) obj[key] = prefix ? `${prefix}${key}` : 1
    return obj
}

router.get(`${_path}/pages`, async (ctx: ctx): Promise<void> => {
    try {
        const query: ParsedUrlQuery & {
            limit: number,
            page: number,
        } = ctx.query as ParsedUrlQuery & {
            limit: number,
            page: number,
        }
        const limit: number = query.limit || 10
        const page: number = query.page || 1
        const arr: Array<Array<UpdateView>> = []
        const result: Array<UpdateView> = await ViewModel.find({});
        for (let i: number = 0; i < result.length; i += limit) arr.push(result.slice(i, i + limit))
        ctx.body = {data: arr[page - 1] || [], pageTotal: arr.length}
    } catch (err) {
        console.error(err)
        ctx.throw(400, '查找数据失败');
    }
})

router.get(`${_path}/pages_condition`, async (ctx: ctx): Promise<void> => {
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
        const pipeline: Array<PipelineStage> = [
            {
                $lookup: {from: as, localField: 'viewId', foreignField: '_id', as}
            }, {
                $unwind: `$${as}`
            }, {
                $match: {
                    $or: [...inKey(getFilter(query, ctx), {
                        ...new UpdateView(),
                        _id: ""
                    }, `${as}.`, "arr") as Array<Record<string, any>>, ...inKey(getFilter(query, ctx), new UpdateContent(), "", "arr") as Array<Record<string, any>>]
                }
            }
        ]
        if (sortName && sort) pipeline.push({$sort: {[sortName]: sort === 'ascending' ? 1 : -1}})
        pipeline.push({
            $project: {
                ...FillingAnObject({
                    ...new UpdateView(),
                    _id: 1,
                    createdAt: 1,
                    updatedAt: 1
                }, `$${as}.`)
            }
        })
        const result: Array<any> = await ContentModel.aggregate(pipeline)
        const arr: Array<any> = []
        for (let i: number = 0; i < result.length; i += limit) arr.push(result.slice(i, i + limit))
        ctx.body = {data: arr[page - 1] || [], pageTotal: arr.length}
    } catch (err) {
        console.error(err)
        ctx.throw(400, '查找数据失败');
    }
});

router.get(`${_path}/search`, async (ctx: ctx): Promise<void> => {
    try {
        const query: ParsedUrlQuery = ctx.query as ParsedUrlQuery
        const as: string = 'update_views'
        const pipeline: Array<PipelineStage> = [
            {
                $lookup: {from: as, localField: 'viewId', foreignField: '_id', as}
            }, {
                $unwind: `$${as}`
            }, {
                $match: {
                    ...inKey(getFilter(query, ctx), {
                        ...new UpdateView(),
                        _id: ""
                    }, `${as}.`), ...inKey(getFilter(query, ctx), new UpdateContent())
                }
            }, {
                $project: {
                    ...FillingAnObject({
                        ...new UpdateView(),
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }, `$${as}.`), ...FillingAnObject(new UpdateContent())
                }
            }
        ]
        const res: Array<UpdateView & UpdateContent> = await ContentModel.aggregate(pipeline)
        ctx.body = res || []
    } catch (err) {
        console.error(err)
        ctx.throw(400, '查找数据失败');
    }
});

router.delete(`${_path}/delete`, async (ctx: ctx): Promise<void> => {
    try {
        const ids: Array<ObjectId> | undefined = (ctx.query as {
            ids: string
        } | undefined)?.ids?.split(",")?.map(item => new ObjectId(item.trim()))
        if (Array.isArray(ids) && ids.length > 0) {
            await ContentModel.deleteMany({viewId: {$in: ids}})
            await ViewModel.deleteMany({_id: {$in: ids}})
            ctx.status = 200;
            ctx.body = {message: '删除数据成功'};
        } else {
            ctx.throw(400, '请提供一个有效的id列表');
        }
    } catch (err) {
        console.error(err)
        ctx.throw(400, '删除数据失败');
    }
})

router.post(`${_path}/create`, async (ctx: ctx): Promise<void> => {
    try {
        const data = ctx.request.body
        if (data) {
            await new ViewModel({...data}).save()
            ctx.status = 200;
            ctx.body = {message: '添加数据成功'};
        } else {
            ctx.throw(400, '添加数据失败');
        }
    } catch (err) {
        console.error(err)
        ctx.throw(400, '添加数据失败');
    }
})

router.put(`${_path}/:id`, async (ctx: ctx): Promise<void> => {
    try {
        const id: string = ctx.params.id
        const data: UpdateView & UpdateContent = ctx.request.body
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
    } catch (err) {
        console.error(err)
        ctx.throw(400, '更新数据失败');
    }
})

export default router

import {apiUrl, publicPath} from "../config";
import fs from "fs"
import Router from "koa-router"
import type {File} from "formidable"
import type {model, ctx} from "../types";
import type {RootFilterQuery} from "mongoose"
import type {ReadStream} from "fs"
import {ObjectId} from "mongodb";

const getFileExtension = (str: string): string | undefined => str.match(/(\.[^\/]+)\/?/)?.[1]

const getFilter = (params: any, ctx: ctx): RootFilterQuery<any> => {
    const query: RootFilterQuery<any> = {};
    for (let key in params) {
        const value: string = params[key] as string;
        if (key.endsWith('_regex')) {
            const regexParts: Array<string> = value.split('/');
            if (regexParts.length === 3) {
                const regex: RegExp = new RegExp(regexParts[1], regexParts[2]);
                query[key.replace('_regex', '')] = {$regex: regex};
            } else {
                ctx.throw(400, `${key}字段格式错误`);
            }
        } else {
            query[key] = value;
        }
        if(key === "_id") query[key] = new ObjectId(value)
    }
    return query
}

const getResources = (router: Router, path: string, model: model): void => {
    router.get(`${path}/search`, async (ctx: ctx): Promise<void> => {
        try {
            ctx.body = await model.find(getFilter(ctx.query, ctx));
        } catch (e) {
            ctx.throw(400, '查找数据失败');
        }
    });
}

const deleteResources = (router: Router, path: string, model: model): void => {
    router.delete(`${path}/delete`, async (ctx: ctx): Promise<void> => {
        try {
            const ids: Array<ObjectId> | undefined = (ctx.query as { ids: string } | undefined)?.ids?.split(",")?.map(item => new ObjectId(item.trim()))
            if (Array.isArray(ids) && ids.length > 0) {
                await model.deleteMany({_id: {$in: ids}});
                ctx.status = 200;
                ctx.body = {message: '删除数据成功'};
            } else {
                ctx.throw(400, '请提供一个有效的id列表');
            }
        } catch (e) {
            ctx.throw(400, '删除数据失败');
        }
    })
}

const createResources = (router: Router, path: string, model: model): void => {
    router.post(`${path}/create`, async (ctx: ctx): Promise<void> => {
        try {
            await new model(ctx.request.body).save();
            ctx.status = 200;
            ctx.body = {message: '添加数据成功'};
        } catch (e) {
            ctx.throw(400, '添加数据失败');
        }
    })
}

const updateResources = (router: Router, path: string, model: model): void => {
    router.put(`${path}/:id`, async (ctx: ctx): Promise<void> => {
        try {
            const data = ctx.request.body
            if (data) {
                const id: string = ctx.params.id;
                await model.findByIdAndUpdate(id, data);
                ctx.status = 200;
                ctx.body = {message: '修改数据成功'};
            } else {
                ctx.throw(400, '修改数据失败');
            }
        } catch (e) {
            ctx.throw(400, '修改数据失败');
        }
    })
}

const uploadResources = (router: Router, path: string, saveDirectory: string): void => {
    router.post(`${path}/upload`, async (ctx: ctx): Promise<void> => {
        try {
            const file: File | undefined = ctx.request.files?.file as File | undefined;
            if (file) {
                const reader: ReadStream = fs.createReadStream(file.filepath);
                const name: string = `${file.newFilename}${getFileExtension(typeof file.originalFilename === "string" ? file.originalFilename : "")}`
                reader.pipe(fs.createWriteStream(`${publicPath}/${saveDirectory}/${name}`));
                ctx.status = 200;
                console.log(`${apiUrl}/${saveDirectory}/${name}`)
                ctx.body = {imgSrc: `${apiUrl}/${saveDirectory}/${name}`}
            } else {
                ctx.throw(400, '文件上传失败');
            }
        } catch (e) {
            ctx.throw(400, '文件上传失败');
        }
    })
}

export {
    getResources,
    deleteResources,
    createResources,
    updateResources,
    uploadResources,
    getFilter,
}
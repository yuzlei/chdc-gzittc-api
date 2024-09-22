import {ObjectId} from "mongodb";
import {apiUrl, publicPath, routerPrefix} from "../config";
import fs from "fs-extra"
import path from "path"
import Router from "koa-router"
import type {sort} from "../types";
import type {File} from "formidable"
import type {model, ctx} from "../types";
import type {RootFilterQuery} from "mongoose"
import type {ReadStream} from "fs"
import type {ParsedUrlQuery} from "querystring";

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
        if (key === "_id") query[key] = new ObjectId(value)
    }
    return query
}

const inKey = (object: Record<string, any>, inObject: Record<string, any>, prefix: string = "", mode: "arr" | "obj" = "obj"): Record<string, any> | Array<Record<string, any>> => {
    if (mode === "obj") {
        let obj: Record<string, any> = {}
        for (const key in object) {
            if (inObject.hasOwnProperty(key)) obj[`${prefix}${key}`] = object[key]
        }
        return obj
    } else {
        let arr: Array<Record<string, any>> = []
        for (const key in object) {
            if (inObject.hasOwnProperty(key)) arr.push({[`${prefix}${key}`]: object[key]})
        }
        return arr
    }
}

const getResources = (router: Router, path: string, model: model): void => {
    router.get(`${path}/search`, async (ctx: ctx): Promise<void> => {
        try {
            const res: Array<model> = await model.find(getFilter(ctx.query, ctx))
            ctx.body = res ? res : [];
        } catch (e) {
            ctx.throw(400, '查找数据失败');
        }
    });
}

const getPage = (router: Router, path: string, model: model, modelObj: any): void => {
    router.get(`${path}/pages_condition`, async (ctx: ctx): Promise<void> => {
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
            const limit: number = query.limit || 10
            const page: number = query.page || 1
            const arr: Array<Array<model>> = []
            const result: Array<model> = await model.find({$or: [...inKey(getFilter(query, ctx), new modelObj(), "", "arr") as Array<Record<string, any>>]});
            for (let i: number = 0; i < result.length; i += limit) arr.push(result.slice(i, i + limit))
            ctx.body = {data: arr[page - 1] ? arr[page - 1] : [], pageTotal: arr.length}
        } catch (e) {
            ctx.throw(400, '查找数据失败');
        }
    })
}

const deleteResources = (router: Router, path: string, model: model): void => {
    router.delete(`${path}/delete`, async (ctx: ctx): Promise<void> => {
        try {
            const ids: Array<ObjectId> | undefined = (ctx.query as {
                ids: string
            } | undefined)?.ids?.split(",")?.map(item => new ObjectId(item.trim()))
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

const uploadResources = (router: Router, _path: string, saveDirectory: string): void => {
    router.post(`${_path}/upload`, async (ctx: ctx): Promise<void> => {
        try {
            const file: File | undefined = ctx.request.files?.file as File | undefined;
            if (file) {
                const reader: ReadStream = fs.createReadStream(file.filepath);
                const name: string = `${file.newFilename}${getFileExtension(typeof file.originalFilename === "string" ? file.originalFilename : "")}`
                reader.pipe(fs.createWriteStream(path.join(publicPath, saveDirectory, name)));
                ctx.status = 200;
                ctx.body = {imgSrc: `${apiUrl}${routerPrefix}/${saveDirectory}/${name}`}
            } else {
                ctx.throw(400, '文件上传失败');
            }
        } catch (e) {
            ctx.throw(400, '文件上传失败');
        }
    })
}

const clearImages = async (model: model, field: string, _path: string): Promise<void> => {
    try {
        const allUserImages: Array<string> = (await model.find().distinct(field)).map((item: string) => path.basename(item));
        const files: Array<string> = await fs.promises.readdir(_path);
        const imagesToDelete: Array<string> = files.filter((file: string) => !allUserImages.includes(file));
        for (const file of imagesToDelete) {
            const filePath: string = path.join(_path, file);
            await fs.remove(filePath);
        }
    } catch (e) {
        console.error(e)
    }
}

export {
    getResources,
    deleteResources,
    createResources,
    updateResources,
    uploadResources,
    getFilter,
    inKey,
    getPage,
    clearImages
}
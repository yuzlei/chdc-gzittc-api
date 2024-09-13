import type {File} from "formidable"
import type {model, ctx} from "../types";
import type {RootFilterQuery} from "mongoose"
import type {ReadStream, WriteStream} from "fs"
import fs from "fs"
import Router from "koa-router"

const getFileExtension = (str: string): string | undefined => str.match(/\/.+(\.[^\/]+)\/?/)?.[1]

const getFilter = (ctx: ctx): RootFilterQuery<any>  => {
    const query: RootFilterQuery<any> = {};
    for (let key in ctx.query) {
        const value: string = ctx.query[key] as string;
        if (key.endsWith('_regex')) {
            const regexParts = value.split('/');
            if (regexParts.length === 3) {
                const regex: RegExp = new RegExp(regexParts[1], regexParts[2]);
                query[key.replace('_regex', '')] = { $regex: regex };
            } else {
                ctx.throw(400, `${key}字段的正则表达式格式错误`);
            }
        } else {
            query[key] = value;
        }
    }
    return query
}

const getResources = (router: Router, path: string, model: model): void => {
    router.get(`${path}/search`, async (ctx: ctx): Promise<void> => {
        try {
            ctx.body = await model.find(getFilter(ctx));
        } catch (e) {
            ctx.throw(500, '服务器错误');
        }
    });
}

const deleteResources = (router: Router, path: string, model: model): void => {
    router.delete(path, async (ctx: ctx): Promise<void> => {
        try {
            const ids: Array<string> | undefined = (ctx.request.body as {ids: Array<string>} | undefined)?.ids
            if(Array.isArray(ids) && ids.length > 0) {
                await model.deleteMany({ _id: { $in: ids } });
                ctx.status = 200;
                ctx.body = { message: '删除成功' };
            }else {
                ctx.throw(400, '请提供一个有效的id列表');
            }
        } catch (e) {
            ctx.throw(400, '删除失败');
        }
    })
}

const createResources = (router: Router, path: string, model: model): void => {
    router.post(`${path}/create`, async (ctx: ctx): Promise<void> => {
        try {
            await new model(ctx.request.body).save();
            ctx.status = 200;
            ctx.body = { message: '增加成功' };
        } catch (e) {
            ctx.throw(400, '增加失败');
        }
    })
}

const updateResources = (router: Router, path: string, model: model): void => {
    router.put(`${path}/:id`, async (ctx: ctx): Promise<void> => {
        try {
            const data = ctx.request.body
            if(data) {
                const id: string = ctx.params.id;
                await model.findByIdAndUpdate(id, data);
                ctx.status = 200;
                ctx.body = { message: '更新成功' };
            }else {
                ctx.throw(400, '更新失败');
            }
        } catch (e) {
            ctx.throw(400, '更新失败');
        }
    })
}

const uploadResources  = (router: Router, path: string, saveDirectory: string): void => {
    router.post(`${path}/upload`, async (ctx: ctx): Promise<void> => {
        const file: File | undefined = ctx.request.files?.file as File | undefined;
        try {
            if(file) {
                const reader: ReadStream = fs.createReadStream(file.filepath);
                const writer: WriteStream = fs.createWriteStream(`${saveDirectory}${file.newFilename}${getFileExtension(typeof file.originalFilename === "string" ? file.originalFilename : "")}`);
                reader.pipe(writer);
                ctx.status = 200;
                ctx.body = { message: '文件上传成功' };
            }else {
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
    uploadResources
}
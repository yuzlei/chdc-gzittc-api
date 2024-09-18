import {dbUrl, port} from "./config"
import Koa from 'koa';
import mongoose from "mongoose";
import staticFiles from 'koa-static'
import koaBody from 'koa-body'
import router from "./routers";
import cors from "koa2-cors";

mongoose.connect(dbUrl).then(() => console.log("数据库连接成功")).catch(err => console.error(`数据库连接失败${err}`))

const app: Koa = new Koa();

app.use(cors({origin: '*'}))
app.use(koaBody({multipart: true}))
app.use(staticFiles("public"))
app.use(router.routes())

app.listen(port, () => {
    console.log(`服务器在 ${port} 端口运行.`);
});
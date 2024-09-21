import {dbUrl, port, routerPrefix} from "./config"
import Koa from 'koa';
import mongoose from "mongoose";
import staticFiles from 'koa-static'
import mount from 'koa-mount'
import koaBody from 'koa-body'
import router from "./routers";
import cors from "koa2-cors";
import cron from "node-cron";
// import runCleanImages from "./tasks/cleanImages"

mongoose.connect(dbUrl).then(() => console.log("数据库连接成功")).catch(err => console.error(`数据库连接失败${err}`))

const app: Koa = new Koa();

app.use(cors({origin: '*'}))
app.use(koaBody({multipart: true}))
app.use(mount(routerPrefix, staticFiles("public")))
app.use(router.routes())

// cron.schedule('0 * * * *', async () => {
//     console.log('开始清理垃圾...');
//     await runCleanImages()
// });

app.listen(port, () => {
    console.log(`服务器在 ${port} 端口运行.`);
});
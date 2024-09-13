import {routerPrefix} from "../config";
import Router from 'koa-router';
import achieves from "./achieves";
import members from "./members";
import updates from "./updates";

const router: Router = new Router({prefix: routerPrefix})

router.use(achieves.routes())
router.use(members.routes())
router.use(updates.routes())

export default router
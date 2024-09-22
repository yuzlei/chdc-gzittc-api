import {publicPath} from "../../config"
import {Model} from "../../models/members";
import {clearImages} from "../../utils"
import path from "path";

export default () => clearImages(Model, "head", path.join(publicPath, "/images/head"))
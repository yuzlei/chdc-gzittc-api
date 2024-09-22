import {publicPath} from "../../config"
import {Model} from "../../models/achieves";
import {clearImages} from "../../utils"
import path from "path";

export default () => clearImages(Model, "imgSrc", path.join(publicPath, "/images/achieve"))
import {publicPath} from "../../config"
import {Model as ViewModel} from "../../models/update-view";
import {Model as ContentModel} from "../../models/update-content";
import path from "path";
import fs from "fs-extra";

export default async (): Promise<void> => {
    try {
        const _path: string = path.join(publicPath, "/images/update")
        const allCoverImages: Array<string> = (await ViewModel.find().distinct("cover")).map((item: string) => path.basename(item));
        const allContentImages: Array<string> = (await ContentModel.find().distinct("content")).flatMap((item: string): Array<string> => ((item.match(/<img[^>]+src="([^">]+)"/g) as Array<string>).map((imgTag: string): string => imgTag.match(/src="([^"]+)"/)?.[1] as string).map((src: string): string => path.basename(src))));
        const files: Array<string> = await fs.promises.readdir(_path);
        const imagesToDelete: Array<string> = files.filter((file: string) => ![...allCoverImages, ...allContentImages].includes(file));
        for (const file of imagesToDelete) await fs.remove(path.join(_path, file));
    } catch (e) {
        console.error(e)
    }
}
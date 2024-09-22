import {publicPath} from "../../config"
import {Model as ViewModel} from "../../models/update-view";
import {Model as ContentModel} from "../../models/update-content";
import path from "path";
import fs from "fs-extra";

export default async (): Promise<void> => {
    try {
        const _path: string = path.join(publicPath, "/images/update")
        const allCoverImages: Array<string> = (await ViewModel.find().distinct("cover")).map((item: string) => path.basename(item));
        const allContentImages: Array<string> = (await ContentModel.find().distinct("content")).flatMap((item: string): Array<string> => {
            const matches: Array<string> | null = item.match(/<img[^>]+src="([^">]+)"/g)
            if (!matches) return [];
            return (matches.map((imgTag: string): string | null => {
                const srcMatch: RegExpMatchArray | null = imgTag.match(/src="([^"]+)"/);
                return srcMatch ? srcMatch[1] : null;
            }).filter((src: string | null): boolean => src !== null) as Array<string>).map((src: string): string => path.basename(src));
        });
        const files: Array<string> = await fs.promises.readdir(_path);
        const imagesToDelete: Array<string> = files.filter((file: string) => ![...allCoverImages, ...allContentImages].includes(file));
        for (const file of imagesToDelete) {
            const filePath: string = path.join(_path, file);
            await fs.remove(filePath);
        }
    } catch (e) {
        console.error(e)
    }
}
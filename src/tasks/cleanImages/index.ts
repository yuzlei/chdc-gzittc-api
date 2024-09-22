import clearAchieves from "./achieves";
import clearMembers from "./members";
import clearUpdates from "./updates"

export default async (): Promise<void> => {
    try {
        await Promise.all([clearAchieves(), clearMembers(), clearUpdates()])
        console.log('清理垃圾成功');
    } catch (error) {
        console.error(`清理垃圾失败:${error}`);
    }
}
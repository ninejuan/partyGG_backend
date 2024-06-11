import noticeSchema from '../models/article/notice.schema';

async function genId() {
    const notice = (await noticeSchema.find()).length;
    return notice + 1;
}

export default genId;
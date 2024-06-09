import articleSchema from '../models/article/article.schema';

async function genId() {
    const article = (await articleSchema.find()).length;
    return article + 1;
}

export default genId;
import * as crypto from 'crypto';
import articleSchema from '../models/article/article.schema';

async function genId() {
    const fgen = crypto.randomInt(1000000000000, 9999999999999); // article ID는 13자리 randomInt
    const article = await articleSchema.findOne({
        articleId: fgen
    });
    return (!article) ? fgen : await genId();
}

export default genId;
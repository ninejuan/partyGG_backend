import mongo from 'mongoose';

const articleSchema = new mongo.Schema({
    writerId: { type: Number, required: true }, // writer's pggId
    articleId: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Array, required: true }, // String Data, `${user_id}`
    views: { type: Array, required: true }, // String Data, `${user_id}`
    aType: { type: String, required: true },
    category: { type: String, required: true }, // IT, 디자인, 게임, 스터디, 기타
    createdAt: { type: Number, required: true }, // Date.now() 형식(ms type)
})

export default mongo.model('article', articleSchema);
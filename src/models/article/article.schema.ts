import mongo from 'mongoose';

const articleSchema = new mongo.Schema({
    writerId: { type: Number, required: true }, // writer's pggId
    articleId: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Array, required: true }, // String Data, `${user_id}`
    views: { type: Array, required: true }, // String Data, `${user_id}`
    aType: { type: String, required: true },
    createdAt: { type: Number, required: true }, // Date.now() 형식(ms type)
    isEnded: { type: Boolean, default: false }
})

export default mongo.model('article', articleSchema);
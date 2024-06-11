import mongo from 'mongoose';

const noticeSchema = new mongo.Schema({
    writerId: { type: Number, required: true }, // writer's pggId
    articleId: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Array, required: true }, // String Data, `${user_id}`
    views: { type: Array, required: true }, // String Data, `${user_id}`
    createdAt: { type: Number, required: true }, // Date.now() 형식(ms type)
})

export default mongo.model('notices', noticeSchema);
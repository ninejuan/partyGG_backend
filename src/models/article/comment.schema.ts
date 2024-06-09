import mongo from 'mongoose';

const commentSchema = new mongo.Schema({
    articleId: { type: Number, required: true },
    writerId: { type: Number, required: true },
    content: { type: String, required: true },
    createdAt: { type: Number, required: true }
})

export default mongo.model('comments', commentSchema);
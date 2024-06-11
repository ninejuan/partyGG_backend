interface Notice {
    writerId: Number;
    articleId?: Number;
    title: String;
    content: String;
    likes: Array<String>;
    views: Array<String>;
    createdAt: Number;
}

export default Notice;
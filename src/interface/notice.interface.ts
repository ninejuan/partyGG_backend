interface Notice {
    writerId: Number;
    articleId?: String;
    title: String;
    content: String;
    views: Array<String>;
    createdAt: Number;
}

export default Notice;
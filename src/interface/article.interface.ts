interface Article {
    writerId: Number;
    articleId?: Number;
    title: String;
    content: String;
    likes: Array<Number>;
    views: Array<String>;
    aType: String; // 팀원 구인<'human'>, 팀 구하기<'team'>
    createdAt: Number;
    isEnded?: Boolean;
}

export default Article;
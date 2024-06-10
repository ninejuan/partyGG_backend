interface Article {
    writerId: Number;
    articleId?: Number;
    title: String;
    content: String;
    likes: Array<Number>;
    views: Array<String>;
    aType: String; // 팀원 구인<'human'>, 팀 구하기<'team'>
    category: String; // IT, 디자인, 게임, 스터디, 기타
    createdAt: Number;
    isEnded?: Boolean;
}

export default Article;
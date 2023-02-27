({
    formatArticle: function (component, newsArticleData) {
        var helper = this;
        var contentArr = [];
        
        //Title
        var titleText = findTextInContent(newsArticleData.data.attributes.headline.main.content);
        newsArticleData.title = contentArr.join("");
        contentArr = [];
        
        //Body
        var bodyText = findTextInContent(newsArticleData.data.attributes.body[0].content);
        newsArticleData.body = contentArr.join("");
        contentArr = [];

        //Publication date
        newsArticleData.publicationDate = newsArticleData.data.attributes.publication_date;

        //Publisher
        newsArticleData.publisherName = newsArticleData.data.attributes.publisher.name;

        //Id
        newsArticleData.id = newsArticleData.data.id;

        function findTextInContent(content) {
            if (content.type && content.type == "Paragraph" && contentArr.length > 0) {
                contentArr.push("<br/><br/>");
            }

            if (content.text) {
                //Replace new line chars with html breaks
                contentArr.push(content.text.replace(/\n/g, "<br/>"));
                return;
            }

            if (content instanceof Array) {
                content.forEach(item => {
                    findTextInContent(item);
                });
            } else {
                //Doesnt have text prop, and not an array
                if(content.hasOwnProperty("content"))
                    findTextInContent(content["content"]);
            }
        }
    }
})
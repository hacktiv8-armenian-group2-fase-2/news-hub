'use strict'

const axios = require("axios");

class newsController{
    static toList(req, res, next){
        let listBerita = [];

        axios.get('https://newsapi.org/v2/top-headlines?country=id&apiKey=' + process.env.NEWSAPI_API_KEY)
        .then(result => {
            result.data.articles.forEach(el => {
                listBerita.push (
                    {
                        title: el.title,
                        description: el.description,
                        url: el.url,
                        imageUrl: el.urlToImage,
                        publishedAt: el.publishedAt
                    }
                )
            });
            
            return axios.get('https://gnews.io/api/v4/top-headlines?token=' + process.env.GNEWS_API_TOKEN)
        })
        .then(result => {
            result.data.articles.forEach(el => {
                listBerita.push (
                    {
                        title: el.title,
                        description: el.description,
                        url: el.url,
                        imageUrl: el.image,
                        publishedAt: el.publishedAt
                    }
                )
            });
            
            return axios.get('https://api.spaceflightnewsapi.net/v3/articles')
        })
        .then(result => {
            result.data.forEach(el => {
                listBerita.push (
                    {
                        title: el.title,
                        description: el.summary,
                        url: el.url,
                        imageUrl: el.imageUrl,
                        publishedAt: el.publishedAt
                    }
                )
            });


            res.status(200).json(
                listBerita
            )
        })
        .catch(err => {
            // next(err)
            res.status(200).json(
                listBerita
            )
        })
    }
}

module.exports = newsController;
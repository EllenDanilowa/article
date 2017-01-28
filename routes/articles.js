var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });
var config = require('../configs/config.json');

var ArticleController = require('../controllers/ArticleController');

router.get('/', function(req, res) {
	ArticleController.getLastArticles().then((articles) => {
		const newArticles = [];
		articles.forEach((article, index) => {
			newArticles[index] = {
				author: article.author,
				description: article.description,
				title: article.title,
				link: article.link,
				imageUrl: `http://localhost:${config.port}/uploads/${article.imageHash}`,
				creation_date: article.creation_date
			};
		});

		return res.status(200).json(newArticles);
	})
	.catch((error) => {
		console.log(error);
		return res.status(500).send();
	});
});

router.get('/new', function(req, res) {
	if (!req.user) {
        return res.status(302).send();
    }

	res.render('new-article', {});
});

router.post('/', upload.single('image'), function(req, res) {
	/*if (!req.user) {
        return res.status(401).send();
    }*/

	var article = {
        author: req.user.username, 
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        imageHash: req.file.filename 
    };

	ArticleController.addArticle(article).then(() => {
		return res.status(201).send();
	})
	.catch((error) => {
		console.log(error);
		return res.status(500).send();
	});
});

router.put('/:id', function(req, res) {
    /*if (!req.user) {
        return res.status(401).send();
    }*/
    var id = req.params.id;

    return Article.findById(id, function(err, article) {
        article.author = req.user.username;
        article.title = req.body.title;
        article.description = req.body.description;
        article.link = req.body.link;
        return article.save(function(err, article) {
            if (!err) {
                console.log("article updated");
            } else {
                console.log(err);
                return res.status(500).send();
            }
            return res.status(200).send();
        });
    });
});

router.delete('/:id', function(req, res) {
	if (!req.user) {
        return res.status(401).send();
    }

	var id = req.params.id;
	ArticleController.deleteArticle(id).then(() => {
		return res.status(200).send();
	})
	.catch((error) => {
		console.log(error);
		return res.status(500).send();
	});
});

module.exports.index = router;
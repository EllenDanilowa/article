var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });

var ArticleController = require('../controllers/ArticleController');

console.log('asda');
router.get('/', function(req, res) {
	ArticleController.getLastArticles().then((articles) => {
		return res.status(200).render('articles', { articles: articles });
	})
	.catch((error) => {
		console.log(error);
		return res.status(500).send();
	});
});

router.get('/new', function(req, res) {
	if (!req.user) {
        return res.status(302).redirect('/login');
    }

	res.render('new-article', {});
});

router.post('/', upload.single('image'), function(req, res) {
	if (!req.user) {
        return res.status(401).send();
    }

	var article = {
        author: req.user.username, 
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        imageHash: req.file.filename
    };

	ArticleController.addArticle(article).then(() => {
		return res.status(201).redirect('articles/');
	})
	.catch((error) => {
		console.log(error);
		return res.status(500).send();
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
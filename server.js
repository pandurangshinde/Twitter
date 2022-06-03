const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Users = require('./Models/Users');
const Tweets = require('./Models/Tweet');

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var currentLoggedInUser = '';
app.use(express.json());
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://PandurangShinde:Twenty20@cluster0.zzmyy.mongodb.net/TweetDB?retryWrites=true&w=majority', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => { console.error(error.message) });
db.once('open', () => { console.log("Connected!") }); 

app.get('/', (req, res) =>{
    res.render('pages/index')
})

app.get('/signup', (req, res) => {
    res.render('pages/signup');
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

// Get all users
app.get('/Users',
	async(req, res) => {
		try {
			const resultData = await Users.find();
			res.json({
				status: 'ok',
				data: resultData
			});
		} catch (error) {
			console.log(error.message);
			res.json({status: "error", error});
		}
	});

    // Get  user by username (used for login verification)
    app.get('/User/:username',
        async(req, res) => {
            try {
                const resultData = await Users.find({ UserName: {$eq: req.params.username} });
                if(resultData[0]){
                    res.json({
                        status: 'ok',
                        data: resultData
                    });
                    currentLoggedInUser = resultData[0];
                }else{
                    res.status(404).json({status: 'error'});
                }
            } catch (error) {
                console.log(error.message);
                res.json({status: "error", error});
            }
    });

    // Create user (used in signUp page)
    app.post('/Users',
        async(req, res) => {
            const user = new Users({
                Email: req.body.Email,
                Password: req.body.Password,
                DisplayName: req.body.DisplayName,
                UserName: req.body.UserName,
                Bio: req.body.Bio,
                LogoUri: req.body.LogoUri,
                Base64: req.body.Base64
            });

            try {
                const newUser = await user.save();
                res.json(newUser);
            } catch (error) {
                console.log(error.message);
                res.json({status: "error", error});
            }
    });

    // Get all tweets (useed in /tweets page)
    app.get('/Tweets/:username',
        async(req, res) => {
            try {
                const tweetsAndUserObj = {};
                const resultData = await Tweets.find();
                
                const currentLoggedInUser = await Users.find({ UserName: {$eq: req.params.username} });
                
                tweetsAndUserObj.resultData = resultData;

                tweetsAndUserObj.currentLoggedInUser = currentLoggedInUser;
                res.render('pages/tweets', {tweetsAndUserObj});
            } catch (error) {
                console.log(error.message);
                res.json({status: "error", error});
            }
    });

    // Create new tweet
    app.post('/Tweets',
        async(req, res) => {
            const tweet = new Tweets({
                author: currentLoggedInUser,
                textContent: req.body.textContent,
                likes: 0
            });

            try {
                const newTweet = await tweet.save();
                res.json(newTweet);
            } catch (error) {
                console.log(error.message);
                res.json({status: "error", error});
            }
	});

    // Update like count by tweetID
    app.patch('/Tweets/liked/:id',
        async(req, res) => {
            try {
                const targetTweet = await Tweets.findById(req.params.id);
                targetTweet.likes = parseInt(targetTweet.likes) + 1;
                const oneTweet = await targetTweet.save();
                res.json(oneTweet);
            } catch (error) {
                console.log(error.message);
                res.json({status: "error", error});
            }
	});

    // Edit tweetContent by tweetID
    app.put('/Tweets/edit/:id',
	async(req, res) => {
		try {
            const targetTweet = await Tweets.findById(req.params.id);
            targetTweet.textContent = req.body.textContent;
            const oneTweet = await targetTweet.save();
            res.json(oneTweet);
		} catch (error) {
			console.log(error.message);
			res.json({status: "error", error});
		}
	});

    // Delete tweet by tweetID
    app.delete('/Tweets/Delete/:id',
        async (req, res) => {
            try {
                const targetTweet = await Tweets.findById(req.params.id);
                await Tweets.deleteOne({ _id: req.params.id });
                res.json(targetTweet);
            } catch (error) {
                console.log(error.message);
                res.json({status: "error", error});
            }
    });

app.listen(3000,
	() =>
	console.log('Server is running on port 3000!')
);


const express = require('express');
const router = express.Router();
const models = require('../models');
let shuffledQuestions, answers, previousQuestion, remainQuestions, currentUser;
let score = 0;


//const setupAuth = require('./auth');
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Chilangos'
  });
});

//GET all questions from database, shuffle them and render first question
router.get('/home', function (req, res, next) {
  models.User.findById(req.user)
    .then(user => {
      currentUser = user;
    })
    .then(() => {
      models.Question.findAll()
        .then(questions => {
          shuffleArray(questions);
          shuffledQuestions = questions;
          answers = [questions[0].option_1, questions[0].option_2, questions[0].option_3, questions[0].correct_answer];
          shuffleArray(answers);

          res.render('home', {
            profile: currentUser.username,
            phrase: questions[0].phrase,
            answer1: answers[0],
            answer2: answers[1],
            answer3: answers[2],
            answer4: answers[3],
            score: score,
            isLoggedIn: req.isAuthenticated()
          });
        });
    });
});

//POST answer from user, compare to correct answer and render new question
router.post('/home', function (req, res, next) {

  previousQuestion = shuffledQuestions.shift();
  if (shuffledQuestions.length == 0) {
    if (req.body.answer == previousQuestion.correct_answer) {
      score += 1;
    }
    res.render('endGame', {
      profile: currentUser.username,
      answerStatus: "End of questions!",
      score: score,
      isLoggedIn: req.isAuthenticated()
    });
    score = 0;
  }
  if (req.body.answer == previousQuestion.correct_answer) {
    score += 1;
  }

  shuffleArray(shuffledQuestions);
  answers = [shuffledQuestions[0].option_1, shuffledQuestions[0].option_2, shuffledQuestions[0].option_3, shuffledQuestions[0].correct_answer];
  shuffleArray(answers);

  res.render('home', {
    profile: currentUser.username,
    phrase: shuffledQuestions[0].phrase,
    answer1: answers[0],
    answer2: answers[1],
    answer3: answers[2],
    answer4: answers[3],
    score: score,
    isLoggedIn: req.isAuthenticated()
  });
});

module.exports = router;

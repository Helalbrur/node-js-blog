const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const authMiddleware = require('./middlewares/auth');
const methodOverride = require('method-override');
const app = express();

// import routes
const indexRoute = require('./routes/index');
const userRoute = require('./routes/post');
const postRoute = require('./routes/user');

// set view engine
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Use authMiddleware for all routes below this line
app.use(authMiddleware);

// custom middleware to pass flash messages to all templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// use routes
app.use('/', indexRoute);
app.use('/posts', postRoute);
app.use('/users', userRoute);
app.use('/roles', require('./routes/roles'));



// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

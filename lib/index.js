const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');

const indexRoute = require('./routes/index');
const synthesizeRoute = require('./routes/synthesize');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/', indexRoute);
app.use('/synthesize', synthesizeRoute);

app.listen(3000)

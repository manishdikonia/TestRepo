const express = require('express');
const path = require('path')
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
require('dotenv').config();

// db config 🐰
require('./src/config/db.config');

// providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors());

app.use(compression());

// parse application/json
app.use(express.json({ limit: '5mb' }));
app.use(
	express.urlencoded({
		extended: true,
	})
);

// another logger to show logs in console as well
app.use(morgan('dev'));

// Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!
// DOC: https://helmetjs.github.io/ 😎
app.use(helmet());

const publicDir = require('path').join(__dirname, 'public');
app.use(express.static(publicDir));

const buildPath = path.join(__dirname, 'public');
app.use(express.static(buildPath))

// default api route 😈
app.get("/", (req, res) => {
	res.json({
		status: true,
		message: 'Welcome to backend apis',
		cheers: '🍎',
		docs: `${process.env.BASE_URL}api-docs`,
	})
})
//test cicd
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// import all routes at once
require('./src/utils/routes.utils')(app);

const port = process.env.PORT;
// initilizing server 😻

app.listen(port, () =>
	console.log("\x1b[36m",`🚀 Server is listening on port ${port} `)
	// signale.success('Operation successful')
);

app.get("/api/v1", (req, res) => res.json({ version: 0.1 }));

// Handling non-existing routes
require('./src/utils/error-handler.utils')(app);

module.exports.handler = app;

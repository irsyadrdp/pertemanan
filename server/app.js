//include modules
const express = require('express');	
const app = express();				

const bodyParser = require('body-parser');
//include body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//include routes
const mainRoutes = require('./routes/index.js')
app.use(mainRoutes);

//error handler
app.use((req, res, next) => {
	let notFound = new Error("Endpoint not found");
	notFound.status = 404;
	next(notFound);
});

//error
app.use((err, req, res, next) => {
	let errorData = {
		error 	: err.message,
		status 	: err.status
	};
	res.json(errorData);
});

//start server
let port = 2222
app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});

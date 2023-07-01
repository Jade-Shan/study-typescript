const fs   = require("fs");
const path = require("path");
const http = require("http");
const url  = require("url");

const port = 8000;

const showHTML = (res, content) => {
	res.writeHead(200,{'Content-Type': 'text/html'});
	res.end(content);
};

const show404 = (res, content) => {
	res.writeHead(200,{'Content-Type': 'text/html'});
	res.end("File Not Found");
};

const loadFile = (res, filename, contentType) => {
	console.debug(`load file  : ${filename}`);
	fs.readFile(filename.replace(/\?.*$/, ''), "binary", (err, file) => {
		if (err) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.write(err + "\n");
			res.end();
		} else {
			res.writeHead(200, {'Content-Type': contentType});
			res.write(file, "binary");
			res.end();
		}
	});
};

let server = http.createServer((req, res) => {
	let reqUrl = url.parse(req.url, true);
	console.debug(`request url: ${reqUrl.pathname}`);
	if (reqUrl.pathname === "/") {
		showHTML(res,['<!DOCTYPE html>',
			'<html lang="en">',
			'<head>',
			'<meta charset="UTF-8">',
			'<title>Hello World</title>',
			'</head>',
			'<body>',
			'<a target="_blank" href="/target/test.html">test page 01</a><br/>',
			'<a target="_blank" href="/target/test-browserify.html">test page 02</a><br/>',
			'</body>',
			'</html>'
		].join('\r\n'));
	} else if (/^\/target\/images\/.+/.test(reqUrl.pathname)) {
		loadFile(res, "." + reqUrl.pathname, "image/jpg");
	} else if (
		/^\/target\/styles\/.+/.test(reqUrl.pathname) ||
		/^\/target\/3rd\/styles\/.+/.test(reqUrl)) 
	{
		loadFile(res, "." + reqUrl.pathname, "text/css");
	} else if (
		/^\/target\/scripts\/.+/.test(reqUrl.pathname) ||
		/^\/target\/3rd\/scripts\/.+/.test(reqUrl)) 
	{
		loadFile(res, "." + reqUrl.pathname, "application/javascript;charset=utf-8");
	} else if (/^\/target\/.+/.test(reqUrl.pathname)) {
		loadFile(res, "." + reqUrl.pathname, "text/html");
	} else {
		show404(res);
	}
});
server.listen(port);

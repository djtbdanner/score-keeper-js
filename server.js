const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const path = require('path');

const content = "/public";
const allowedFiles = getContentFiles(content);
const port = 80;

app = http.createServer(function (req, res) {
  let url = req.url;
  if (url.includes(`?fbclid`)){
    let idontwantfacebook = url.indexOf(`?fbclid`);
    console.log(`linked in from facebook: ${url}`);exi
    url = url.substring(0, idontwantfacebook);
  }
  // console.log(`checking URL:${url}, allowed: ${allowedFiles.includes(url)}`);
  if (!allowedFiles.includes(url)){
    res.writeHead(404);
    res.end(JSON.stringify({notfound:url}));
    return;
  }

  if (url === "/" || url === "") {
    url = "/index.html"
  }


  fs.readFile(__dirname + content + url, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    const contentType = getContentTypeString(url);
    res.setHeader("Content-Type", contentType);
    res.writeHead(200);
    res.end(data);
  });
});

const io = socketio(app);
app.listen(port, () => { console.log(`Server listening on port ${port}`) });

module.exports = {
  app,
  io
}

/**
* Create an array of all the files in public for basic security, only serve files in the public directory
* @param contentFolder
* @returns {string[]}
*/
function getContentFiles(contentFolder) {
  let contentFiles = [];

  function buildContentFileList(contentFolder) {
    fs.readdirSync(__dirname + contentFolder).forEach(File => {
      const Absolute = path.join(contentFolder, File);
      if (fs.statSync(__dirname + Absolute).isDirectory()) return buildContentFileList(Absolute);
      else return contentFiles.push(Absolute);
    });
  }

  buildContentFileList(content);
  contentFiles = contentFiles.map(fileName => fileName.split(`\\`).join(`/`).replace(content, ``));
  contentFiles.push(`/`);
  // console.log(`Allowed content files \n ${contentFiles}`);
  return contentFiles;
}

function getContentTypeString(fileName) {
  if (!fileName || fileName.split(`.`).length < 1) {
    console.log(`No content file name returning default ...`)
    return `text/html`;
  }
  const ext = fileName.split(`.`).slice(-1)[0];
  /// if any missing - https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  let type;
  switch (ext) {
    case `bmp`:
      type = `image/bmp`;
      break;
    case `css`:
      type = `text/css`;
      break;
    case `csv`:
      type = `text/csv`;
      break;
    case `doc`:
      type = `application/msword`;
      break;
    case `docx`:
      type = `application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
      break;
    case `eot`:
      type = `application/vnd.ms-fontobject`;
      break;
    case `gz`:
      type = `application/gzip`;
      break;
    case `gif`:
      type = `image/gif`;
      break;
    case `ico`:
      type = `image/vnd.microsoft.icon`;
      break;
    case `jpg`:
      type = `image/jpeg`;
      break;
    case `jpeg`:
      type = `image/jpeg`;
      break;
    case `js`:
      type = `text/javascript`;
      break;
    case `json`:
      type = `application/json`;
      break;
    case `mp3`:
      type = `audio/mpeg`;
      break;
    case `mp4`:
      type = `video/mp4`;
      break;
    case `mpeg`:
      type = `video/mpeg`;
      break;
    case `png`:
      type = `image/png`;
      break;
    case `svg`:
      type = `image/svg+xml`;
      break;
    case `ttf`:
      type = `font/ttf`;
      break;
    case `txt`:
      type = `text/plain`;
      break;
    case `wav`:
      type = `audio/wav`;
      break;
    case `woff`:
      type = `font/woff`;
      break;
    case `woff2`:
      type = `font/woff2`;
      break;
    case `xml`:
      type = `application/xml`;
      break;
    case `zip`:
      type = `application/zip`;
      break;
    case `7z`:
      type = `application/x-7z-compressed`;
      break;
    default:
      type = `text/html`;
  }
  console.log(`Retrieving "${fileName}", as a "${ext}" file, ContentType = ${type}`)
  return type;
}
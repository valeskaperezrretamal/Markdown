#!/usr/bin/env node

let fs = require('fs')
const Marked = require('marked');



const getArchive = () => {
  const args = process.argv;
  const archive = args[2];
  console.log('arg', args[2]);

  return archive;
}


const getOptions = () => {
  const args = process.argv;
  const options = args[3];

  return options;
}



const getDataArchive = (archive) => {
  return new Promise((resolve) => {
    fs.readFile(archive, 'utf-8', (err, data) => {
      if (err) {
        console.log('error:', err);
      } else {
        let markdown = data;
        console.log('markdown', markdown);
        resolve(markdown);
      }
    });
  });
};

module.exports = getDataArchive;

// const getStatusLinks = () => {
//   var myRequest = new Request('https://nodejs.org/api/path.html');

//   fetch(myRequest).then(function (response) {
//     console.log(response.status);
// response.blob().then(function(myBlob) {
//   var objectURL = URL.createObjectURL(myBlob);
//   myImage.src = objectURL;
// });
//   });
// }




const markdownLinkExtractor = (markdown) => {
  const links = [];

  const renderer = new Marked.Renderer();
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = function (href, title, text) {
    links.push(href)
    // ({
    //   href: href,
    // text: text,
    // title: title,
    // });
  };
  renderer.image = function (href, title, text) {
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push(href)
    // ({
    //   href: href,
    //   text: text,
    //   title: title,
    // });
  };
  Marked(markdown, { renderer: renderer });
  console.log('total:', links.length);
  console.log('links:', links);
  return links;
};

const obtener = () => {
  let archive = getArchive();
  getDataArchive(archive).then((markdown) => {
    markdownLinkExtractor(markdown);

  });

};






// console.log('links', getArchive());


// // // exports.arch = markdown;
// // // exports.mdlinks = markdownLinkExtractor(markdown);
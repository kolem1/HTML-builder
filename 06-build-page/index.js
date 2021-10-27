const path = require('path');
const fs = require('fs');

async function build() {
  try {
    const buildPath =  path.join(__dirname, 'project-dist'),
          buildHTMLPath = path.join(buildPath ,'index.html'),
          componentsPath = path.join(__dirname, 'components'),
          templatePath = path.join(__dirname, 'template.html');
    await fs.promises.rm(buildPath, { recursive: true});
    fs.promises.mkdir(buildPath, {recursive: true});

    const readStream = fs.createReadStream(templatePath, 'utf-8');
    const writeStream = fs.createWriteStream(buildHTMLPath);

    readStream.on('data', async (data) => {
      const replacedHTML = await replaceTags();

      writeStream.write(replacedHTML);

      async function replaceTags() {
        let htmlText = data.toString();
        const templateTags = htmlText.match(/{{.+}}/gi);
        for(let item of templateTags) {
          const tagName = item.match(/\w+/)[0];
          const component = await fs.promises.readFile(path.join(componentsPath, `${tagName}.html`));
          htmlText = htmlText.replace(new RegExp(item, 'g'), component.toString());
        }
        return htmlText;
      }
    });

    bundleCSS();
    copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  } catch(err) {
    console.error(err);
  }
}

function bundleCSS() {
  try {
    const bundlePath = path.join(__dirname, 'project-dist' ,'style.css');
    fs.writeFile(bundlePath, '', async () => {
      const stylesFiles = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
      for(const file of stylesFiles) {
        if(file.isFile()) {
          const filePath = path.join(__dirname, 'styles', file.name);
          const ext = path.parse(filePath).ext;
          if(ext === '.css') {
            
            const readStream = fs.createReadStream(filePath, 'utf-8');
            
            let text = ''
            readStream.on('data', (data) => text += data);
            readStream.on('end', () => fs.appendFile(bundlePath, text, () => ''));
          }
        }
      }
    });
  } catch(err) {
    console.error(err);
  }
}

async function copyDir(dirPath, copyDirPath) {
  try {
    fs.promises.mkdir(copyDirPath, {recursive: true});
    const files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = path.join(dirPath, file.name);
        const copyPath = path.join(copyDirPath, file.name);
        fs.promises.copyFile(filePath, copyPath);
      } else {
        copyDir(path.join(dirPath, file.name), path.join(copyDirPath, file.name));
      }
    }
  } catch(err) {
    console.error(err);
  }
}

build()
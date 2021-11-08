const {join, parse} = require('path');
const {createReadStream, createWriteStream} = require('fs');
const {rm, mkdir, readFile, appendFile, readdir, copyFile, writeFile} = require('fs/promises');

async function build() {
  try {
    const buildPath =  join(__dirname, 'project-dist'),
          buildHTMLPath = join(buildPath ,'index.html'),
          componentsPath = join(__dirname, 'components'),
          templatePath = join(__dirname, 'template.html');
    await rm(buildPath, { force: true, recursive: true});
    await mkdir(buildPath, {recursive: true});

    const readStream = createReadStream(templatePath, 'utf-8');
    const writeStream = createWriteStream(buildHTMLPath);

    readStream.on('data', async (data) => {
      const replacedHTML = await replaceTags();

      writeStream.write(replacedHTML);

      async function replaceTags() {
        let htmlText = data.toString();
        const templateTags = htmlText.match(/{{.+}}/gi);
        for(let item of templateTags) {
          const tagName = item.match(/\w+/)[0];
          const component = await readFile(join(componentsPath, `${tagName}.html`));
          htmlText = htmlText.replace(new RegExp(item, 'g'), component.toString());
        }
        return htmlText;
      }
    });

    bundleCSS();
    copyDir(join(__dirname, 'assets'), join(__dirname, 'project-dist', 'assets'));
  } catch(err) {
    console.error(err);
  }
}

async function bundleCSS() {
  try {
    const bundlePath = join(__dirname, 'project-dist' ,'style.css');
    await writeFile(bundlePath, '');
    const stylesFiles = await readdir(join(__dirname, 'styles'), {withFileTypes: true});
    for(const file of stylesFiles) {
      if(file.isFile()) {
        const filePath = join(__dirname, 'styles', file.name);
        const ext = parse(filePath).ext;
        if(ext === '.css') {
          
          const readStream = createReadStream(filePath, 'utf-8');
          
          let text = ''
          readStream.on('data', (data) => text += data);
          readStream.on('end', () => appendFile(bundlePath, text + '\n'));
        }
      }
    }
  } catch(err) {
    console.error(err);
  }
}

async function copyDir(dirPath, copyDirPath) {
  try {
    await mkdir(copyDirPath, {recursive: true});
    const files = await readdir(dirPath, {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = join(dirPath, file.name);
        const copyPath = join(copyDirPath, file.name);
        copyFile(filePath, copyPath);
      } else {
        copyDir(join(dirPath, file.name), join(copyDirPath, file.name));
      }
    }
  } catch(err) {
    console.error(err);
  }
}

build()
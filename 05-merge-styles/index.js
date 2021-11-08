const {join, parse} = require('path');
const {createReadStream} = require('fs')
const {writeFile, readdir, appendFile} = require('fs/promises');

async function bundleCSS() {
  try {
    const bundlePath = join(__dirname, 'project-dist' ,'bundle.css');
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

bundleCSS()
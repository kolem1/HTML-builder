const path = require('path');
const fs = require('fs');

function bundleCSS() {
  try {
    const bundlePath = path.join(__dirname, 'project-dist' ,'bundle.css');
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

bundleCSS()
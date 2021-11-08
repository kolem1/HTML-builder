const path = require('path')
const fs = require('fs');

async function readFolder() {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const info = path.parse(filePath);
        const name = info.name;
        const ext = info.ext.slice(1);
        fs.stat(filePath, (err, stats) => {
          console.log(`${name} - ${ext} - ${stats.size} byte `)
        });
      }
    }
  } catch(err) {
    console.error(err);
  }
}

readFolder();


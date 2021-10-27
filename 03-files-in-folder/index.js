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
        let size;
        fs.stat(filePath, (err, stats) => {
          size = Math.round(stats.size / 1024 * 100) / 100;
          console.log(`${name} - ${ext} - ${size}kb `)
        });
      }
    }
  } catch(err) {
    console.error(err);
  }
}

readFolder();


const {join, parse} = require('path')
const {readdir, stat} = require('fs/promises');

async function readFolder() {
  try {
    const files = await readdir(join(__dirname, 'secret-folder'), {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = join(__dirname, 'secret-folder', file.name);
        const info = parse(filePath);
        const name = info.name;
        const ext = info.ext.slice(1);
        const size = await stat(filePath).then((stat) => stat.size);
        console.log(`${name} - ${ext} - ${size} byte `)
      }
    }
  } catch(err) {
    console.error(err);
  }
}

readFolder();


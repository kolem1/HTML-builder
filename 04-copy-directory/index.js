
const {join} = require('path')
const {mkdir, readdir, copyFile} = require('fs/promises');

async function copyDir() {
  try {
    await mkdir(join(__dirname, 'files-copy'), {recursive: true});
    const files = await readdir(join(__dirname, 'files'), {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = join(__dirname, 'files', file.name);
        const copyPath = join(__dirname, 'files-copy', file.name);
        copyFile(filePath, copyPath);
      }
    }
  } catch(err) {
    console.error(err);
  }
}

copyDir();
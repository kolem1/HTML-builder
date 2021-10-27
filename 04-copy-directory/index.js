
const path = require('path')
const fs = require('fs/promises');

async function copyDir() {
  try {
    fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
    const files = await fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = path.join(__dirname, 'files', file.name);
        const copyPath = path.join(__dirname, 'files-copy', file.name);
        fs.copyFile(filePath, copyPath);
      }
    }
  } catch(err) {
    console.error(err);
  }
}

copyDir();
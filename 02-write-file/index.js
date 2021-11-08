const { stdin, stdout } = process;
const path = require('path')
const {writeFile, appendFile} = require('fs');

const textPath = path.join(__dirname, 'text.txt');

stdout.write('Введите текст для записи\n');
writeFile(textPath, '', () => {
  stdin.on('data', (data) => {
    if(data.toString().trim() === 'exit') {
      stopInput();
    }
    appendFile(textPath, data, () => '');
    }
  );
});

process.on('SIGINT', stopInput);

function stopInput() {
  stdout.write('Спасибо! Созданный файл text.txt находится в папке 02-write-fail')
  process.exit();
}
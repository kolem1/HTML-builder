const { stdin, stdout } = process;
const path = require('path')
const fs = require('fs');


const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Введите текст для записи\n');
stdin.on('data', (data) => {
  if(data.toString().trim() === 'exit') {
    stopInput();
  }
  output.write(data)
  }
);

process.on('SIGINT', stopInput);

function stopInput() {
  stdout.write('Спасибо! Созданный файл text.txt находится в папке 02-write-fail')
  process.exit();
}
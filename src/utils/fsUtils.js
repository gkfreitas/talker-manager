const fs = require('fs');
const path = require('path');

const talkerFile = '../talker.json';

async function readTalker() {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, talkerFile), 'utf-8');
    const missions = JSON.parse(data);

    return missions;
  } catch (err) {
    console.log(`Erro no arquivo ${err}`);
  }
}
readTalker();
module.exports = {
  readTalker,
};
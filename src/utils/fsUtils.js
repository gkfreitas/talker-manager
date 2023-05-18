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

async function writeTalker(newTalker) {
  try {
    const oldFile = await readTalker();
    const lastId = oldFile[oldFile.length - 1].id;
    const newTalkerWithId = { id: lastId + 1, ...newTalker };
    const newFile = JSON.stringify([...oldFile, newTalkerWithId]);
    await fs.writeFileSync(path.resolve(__dirname, talkerFile), newFile);

    return JSON.parse(newFile);
  } catch (err) {
    console.log(`Erro no arquivo: ${err}`);
  }
}

async function updateTalker(id, updatedTalker) {
  const oldFile = await readTalker();
  const newTalker = { id, ...updatedTalker };
  const findTalker = oldFile.find((e) => e.id === Number(id));
  const newFile = JSON.stringify(oldFile.map((e) => (e === findTalker ? newTalker : e)));
  try {
    await fs.writeFileSync(path.resolve(__dirname, talkerFile), newFile);
  } catch (err) {
    console.log(err);
  }
}

async function deleteTalker(id) {
  const oldFile = await readTalker();
  const findTalker = oldFile.find((e) => e.id === Number(id));
  const newFile = JSON.stringify(oldFile.filter((e) => (e !== findTalker)));
  console.log(newFile);
  try {
    await fs.writeFileSync(path.resolve(__dirname, talkerFile), newFile);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  deleteTalker,
  updateTalker,
  readTalker,
  writeTalker,
};
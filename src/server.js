const index = require('./index');
const connection = require('./db/connection');

const PORT = 3001;
console.log('oi');
index.listen(PORT, async () => {
  console.log(`API TalkerManager está sendo executada na porta ${PORT}`);
  const [result] = await connection.execute('SELECT 1');
  if (result) {
    console.log('MySQL connection OK');
  }
});
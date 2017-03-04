const { MysqlClient } = require('../../src/mysql/MysqlClient');
const { TransactionManager } = require('../../src/transaction/TransactionManager');

const myClient = new MysqlClient();
myClient.name = 'TestClient';
myClient.configuration = {
  Verbose: true,
  Master: { database: 'testdb' }
};

myClient.initialise();

describe('MysqlClient', () => {
  describe('Basic queries', () => {
    xit('Gets all 3 records', () =>
      TransactionManager.runInTransaction(true, function* () {
        const rows = yield myClient.queryAll('SELECT * FROM table1');
        rows.length.must.be.equal(3);
      }));
    xit('Gets all 3 records twice', () =>
      TransactionManager.runInTransaction(true, function* () {
        const rows = yield myClient.queryAll('SELECT * FROM table1');
        rows.length.must.be.equal(3);
        const rows2 = yield myClient.queryAll('SELECT * FROM table1');
        rows2.length.must.be.equal(3);
      }));
    xit('Gets all 3 records v2', function* () {
      TransactionManager.runInTransaction(true, myClient.queryAll('SELECT * FROM table1')).then(
        (rows) => {
          console.log(rows);
          rows.length.must.be.equal(3);
        }
      );
    });
  });
});
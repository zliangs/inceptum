const { MysqlClient } = require('../../src/mysql/MysqlClient');

const myClient = new MysqlClient();
myClient.name = 'TestClient';
myClient.configuration = {
  Verbose: true,
  master: { database: 'testdb' }
};

myClient.initialise();

describe('MysqlClient', () => {
  describe('Basic queries', () => {
    it('Gets all 3 records', 
    () => myClient.runInTransaction(true, (mysqlTransaction) => mysqlTransaction.query('SELECT * FROM table1'))
        .then((rows) => {
          rows.length.must.be.equal(3);
        })
     );
    it('Gets all 3 records inside', () => myClient.runInTransaction(true,
      (mysqlTransaction) => mysqlTransaction.query('SELECT * FROM table1')
        .then((rows) => {
          rows.length.must.be.equal(3);
        })
    ));
    it('Gets all 3 records twice', () => myClient.runInTransaction(true,
      (mysqlTransaction) => mysqlTransaction.query('SELECT * FROM table1')
        .then((rows) => {
          rows.length.must.be.equal(3);
        })
        .then(() => mysqlTransaction.query('SELECT name FROM table1'))
        .then((rows) => {
          rows.length.must.be.equal(3);
        })
    ));
  });
  describe('Rolling Back', () => {
    it('Rolls back if there\'s an error', 
    async () => {
      const holder = {};
      try {
        const rows = await myClient.runInTransaction(true, (mysqlTransaction) => {
          holder.transaction = mysqlTransaction;
          return mysqlTransaction.query('SELECT FROM table1')
        })
        true.must.equal(false);
      } catch(cause) {
        cause.must.be.an.error(/You have an error in your SQL syntax/);
        holder.transaction.isRolledBack().must.be.true();
      }
    });
  });
});

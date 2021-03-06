const { SqsClient } = require('../../src/sqs/SqsClient');
const { SqsWorker } = require('../../src/sqs/SqsWorker');
const { SqsHandler } = require('../../src/sqs/SqsWorker');

const Queue_Url = 'localhost:9432';

const clientConfig = {
  queueUrl: Queue_Url
};
const myClient = new SqsClient(clientConfig, 'TestClient');

myClient.initialise();

const msg = {
  foo: "bar"
};

const params = {
  MessageBody: JSON.stringify(msg), /* required */
  DelaySeconds: 0
};


const workerConfig = {
  queueUrl: Queue_Url
};
const myWorker = new SqsWorker(workerConfig, 'TestWorker');

class myHandler extends SqsHandler {
  static handle(message, done) {
    console.log(message);
    try {
      done();
    } catch (err) {
      done(err);
    }
  };
}
myWorker.handler = myHandler;

describe.skip('SqsClient', () => {
  describe('Basic methods', () => {
    it('Send message', (done) => myClient.sendMessage(params, (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        done();
      })
    );
  });
});

describe.skip('SqsWorker', () => {
  describe('Basic methods', () => {
    it('Polling message', (done) => {
        myWorker.initialise();
        setTimeout(done, 1000);
      }
    );
  });
});

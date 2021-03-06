
export class TransactionError extends Error {
}

export class Transaction {

  static idInc: number;

  id: number;
  readonly: Boolean;
  began: Boolean;
  finished: Boolean;
  error: Error;
  commitListeners: Array<(Transaction) => Promise<any>>;
  rollbackListeners: Array<(Transaction) => Promise<any>>;
  endListeners: Array<(Transaction) => Promise<any>>;

  constructor(readonly: boolean) {
    this.id = Transaction.idInc++;
    this.readonly = readonly;
    this.began = false;
    this.finished = false;
    this.error = null;
    this.commitListeners = [];
    this.rollbackListeners = [];
    this.endListeners = [];
  }
  begin() {
    if (this.began) {
      throw new TransactionError('Transaction is already started');
    }
    this.began = true;
  }
  hasBegun() {
    return this.began;
  }
  markError(e) {
    this.error = e;
  }
  addCommitListener(f) {
    if (!f || !(f instanceof Function)) {
      throw new TransactionError('Provided input to addCommitListener is not a function');
    }
    this.commitListeners.push(f);
  }
  addRollbackListener(f) {
    if (!f || !(f instanceof Function)) {
      throw new TransactionError('Provided input to addRollbackListener is not a function');
    }
    this.rollbackListeners.push(f);
  }
  addEndListener(f) {
    if (!f || !(f instanceof Function)) {
      throw new TransactionError('Provided input to addEndListener is not a function');
    }
    this.endListeners.push(f);
  }

  /**
   * @return {Promise} A promise that executes all the callbacks necessary
   */
  async end(): Promise<void> {
    if (!this.began) {
      // console.log('Transaction never got started, so can\'t be finished');
      throw new TransactionError('Transaction never got started, so can\'t be finished');
    }
    if (this.finished) {
      // console.log('Transaction is already finished');
      throw new TransactionError('Transaction is already finished');
    }
    this.finished = true;
    if (this.error) {
      // console.log(`Emitting rollback for ${this.error} ${this.error.stack}`);
      await this.callListeners(this.rollbackListeners);
    } else {
      await this.callListeners(this.commitListeners);
    }
    await this.callListeners(this.endListeners);
  }

  canDo(readonly) {
    return !this.readonly || readonly;
  }
  isReadonly() {
    return this.readonly;
  }

  callListeners(listeners) {
    if (listeners && listeners.length > 0) {
      return Promise.all(listeners.map((listener) => listener(this)).filter((resp) => !!resp));
    }
    return Promise.resolve();
    // for (let i = 0; i < listeners.length; i++) {
    //   const result = listeners[i](this);
    //   if (result && result.then) {
    //     throw new TransactionError(`${type} listener returned a promise. Callbacks are expected to be synchronous`);
    //   }
    // }
  }
}

Transaction.idInc = 1;

export class TransactionManager {

  static newTransaction(readonly) {
    return new Transaction(readonly);
  }
}

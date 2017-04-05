const { AggregateCommand } = require('../../src/cqrs/command/AggregateCommand');
const { AggregateCreatingCommand } = require('../../src/cqrs/command/AggregateCreatingCommand');
const { AggregateCreatingEvent } = require('../../src/cqrs/event/AggregateCreatingEvent');
const { AggregateEvent } = require('../../src/cqrs/event/AggregateEvent');

class TodoCreatedEvent extends AggregateCreatingEvent {
  constructor(aggregateId, issuerCommandId, eventId, title, description) {
    super('Todo', aggregateId, issuerCommandId, eventId);
    this.title = title;
    this.description = description;
  }
  apply(aggregate) {
    aggregate.title = this.title;
    aggregate.description = this.description;
    aggregate.status = 'NotDone';
  }
}

class MarkedTodoDoneEvent extends AggregateEvent {
  apply(aggregate) {
    aggregate.status = 'Done';
  }
}

class CreateTodoCommand extends AggregateCreatingCommand {
  constructor(aggregateId, commandId) {
    super('Todo', aggregateId, commandId);
  }
  doExecute(executionContext) {
    executionContext.commitEvent(new TodoCreatedEvent(this.getAggregateId(), this.getCommandId(), undefined, this.title, this.description));
  }
  validate() {
    if (!this.title) {
      throw new Error('Need to specify a title for the Todo');
    }
    if (!this.description) {
      throw new Error('Need to specify a description for the Todo');
    }
  }
  static fromObject(obj) {
    if (!obj.aggregateId) {
      throw new Error('Need to specify an aggregateId for the Todo');
    }
    const instance = new CreateTodoCommand(obj.aggregateId, obj.commandId || undefined);
    const copy = Object.assign({}, obj);
    delete copy.aggregateId;
    delete copy.commandId;
    delete copy.aggregateType;
    return Object.assign(instance, copy);
  }
}

class MarkTodoDoneCommand extends AggregateCommand {
  doExecute(executionContext) {
    executionContext.commitEvent(new MarkedTodoDoneEvent(this.getAggregateId(), this.getCommandId()));
  }
  validate(executionContext, aggregate) {
    if (aggregate.status !== 'NotDone') {
      throw new Error('Aggregate is not currently in NotDone');
    }
  }
  static fromObject(obj) {
    if (!obj.aggregateId) {
      throw new Error('Need to specify an aggregateId for the Command');
    }
    const instance = new MarkTodoDoneCommand(obj.aggregateId, obj.commandId || undefined);
    const copy = Object.assign({}, obj);
    delete copy.aggregateId;
    delete copy.commandId;
    return Object.assign(instance, copy);
  }
}

module.exports = { CreateTodoCommand, TodoCreatedEvent, MarkTodoDoneCommand };

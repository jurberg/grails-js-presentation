/*global describe, it, expect, beforeEach, jasmine, TodoModel */
describe("Todo Model", function() {
  'use strict';

  var todo = null;

  beforeEach(function() {
    todo = new TodoModel();
  });

  it("should increment order", function() {
    var order = todo.get("order");
    var nextTodo = new TodoModel();
    expect(nextTodo.get("order")).toBe(order + 1);
  });

  it("should toggle done", function() {
    todo.save = jasmine.createSpy();
    expect(todo.get("done")).toBe(false);
    todo.toggle();
    expect(todo.save).toHaveBeenCalledWith({done: true});
  });

});
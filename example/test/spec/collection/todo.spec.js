/*global define, describe, it, expect */
define(['app/collection/todo'], function(Todos) {
  'use strict';
  describe("Todo Collection", function() {

    it("should have the correct url", function() {
      expect(Todos.url).toBe("/todos");
    });

    it("should have todos", function() {
      expect(Todos.length).toBe(0);
      Todos.create({text: "test"});
      expect(Todos.length).toBe(1);
      expect(Todos.at(0).get("text")).toBe("test");
    });

  });
});
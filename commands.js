"use strict";

const fs = require('fs');

var exports = module.exports = Commands;

function Commands() {
  this.commands = {};
  this.create("test", "Test command", this.test.bind(this));
  this.create("help", "Lists all commands", this.help.bind(this));
}

Commands.prototype.execute = function(args, msg) {
  return this.commands[args[0]].callback(args);
}

Commands.prototype.create = function(command, description, callback) {
  this.commands[command] = {command: command, description: description, callback: callback};
}

Commands.prototype.update = function() {

}

Commands.prototype.destroy = function() {

}

Commands.prototype.test = function(args) {
  return "THIS IS A TEST";
}

Commands.prototype.help = function(args) {
  var self = this;
  var response = "";
  Object.keys(self.commands).forEach(command => {
    var c = self.commands[command];
    response += `${c.command} - ${c.description}\n`;
  });
  return response;
}

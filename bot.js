const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const Commands = require('./commands.js');
const sqlite = require('sqlite-sync');
sqlite.connect('w00tb0t.db');
var commands = new Commands();
var syntax = {};

var config;
fs.readFile('config.json', (err, data) => {
  if(err) {
    console.log(err);
    return;
  }
  if(!data) {
    console.log('No data');
    return;
  }
  config = JSON.parse(data);

  client.login(config.token);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  initCommands();
});

client.on('message', msg => {
  if(!(msg.content[0] === '!')) return;
  var args = msg.content.slice(1).split(' ');
  var response = commands.execute(args, msg);
  msg.channel.send(response);
});

function initCommands() {
  commands.create('party', 'Party time dudes!', party.bind(this));
  client.guilds.forEach(guild => {
    sqlite.run(`CREATE TABLE IF NOT EXISTS quotes_${guild.id} (quote TEXT)`);
  });
  commands.create('quote', 'Displays a random quote specific to guild OR adds new quote to guild', quote.bind(this));
  syntax['quote'] = "Syntax: !quote OR !quote add <quote goes here>";
}

function party(args) {
    var online = [];
    client.users.forEach(user => {
      if(user.presence.status === 'online') online.push(user);
    });
    var choice = Math.floor(Math.random()*online.length);
    while(online[choice].bot) {
      choice = Math.floor(Math.random()*online.length);
    }
    return `It's party time and everyone execpt ${online[choice].username} is invited!`;
}

function quote(args, msg) {
  if(args[1]) {
    if(args[1] === 'add') {
      args.shift();
      args.shift();
      var quote = args.join(' ');
      var id = sqlite.insert(`quotes_${msg.guild.id}`, {quote: quote});
      if(id.error) return 'Quote could not be added, please do not use \' because I\'m lazy and can\'t figure out how to make databases like them. :\(';
      return 'Quote successfully added!';
    } else {
      return syntax.quote;
    }
  } else {
    var rows = sqlite.run(`SELECT * FROM quotes_${msg.guild.id}`);
    if(rows.length == 0) {
      return 'No quotes found for this guild. You can add quotes by typing !quote add <quote goes here>';
    }
    var choice = Math.floor(Math.random()*rows.length);
    return '' + rows[choice].quote;
  }
}

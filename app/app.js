/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Bot entrypoint. Initialize, configure, create HTTP endpoints, etc.
 */
"use strict";
var bot = require('@menome/botframework')
var models = require('./models.js')
var config = require('./config.js');
var harvester = require('./harvester')

// We only need to do this once. Bot is a singleton.
bot.configure({
  name: "JsonPlaceholder harvester",
  desc: "Harvests from JSON Placeholder",
  logging: config.get('logging'),
  port: config.get('port'),
  rabbit: config.get('rabbit')
});

// Register our sync endpoint.
bot.registerEndpoint({
  "name": "Synchronize",
  "path": "/sync",
  "method": "POST",
  "desc": "Runs a full sync of REST endpoint through the harvester."
}, function(req,res) {
  res.send("Starting the REST Harvest")
  harvester.harvestAll();
});


// Start the bot.
bot.start();
bot.changeState({state: "idle"})
/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";
var convict = require('convict');
var fs = require('fs');
var bot = require('@menome/botframework')

// Define a schema
var config = convict({
  url: {
    doc: "The URL of the REST Endpoint we're grabbing",
    format: "url",
    default: "https://jsonplaceholder.typicode.com",
    env: "API_URL"
  },
  key: {
    doc: "The api-key of the REST Endpoint we're grabbing",
    format: "String",
    default: "",
    env: "API_KEY"
  },
  port: bot.configSchema.port,
  logging: bot.configSchema.logging,
  rabbit: bot.configSchema.rabbit,
});

// Load from file.
if (fs.existsSync('./config/config.json')) {
  config.loadFile('./config/config.json');
}

// Validate the config.
config.validate({allowed: 'strict'});

module.exports = config;
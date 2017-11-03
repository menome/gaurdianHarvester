/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Core harvester code.
 */
"use strict";
var rp = require('request-promise');
var models = require('./models');
var bot = require('@menome/botframework')
var config = require('./config');

module.exports = {
  harvestAll
}

// Kicks off the harvester for each type of data.
async function harvestAll() {
  bot.changeState({state: "working"})
  bot.logger.info("Starting Tag Harvest");
  await getBatchEndpoint(config.get('url')+"/tags", models.tagTransform, 4971);
  bot.logger.info("Tag Harvest Finished");
  bot.logger.info("Starting Section Harvest");  
  await getBatchEndpoint(config.get('url')+"/sections", models.secTransform, 0);
  bot.logger.info("Section Harvest Finished");
  bot.logger.info("Starting Edition Harvest");  
  await getBatchEndpoint(config.get('url')+"/editions", models.edTransform, 0);
  bot.logger.info("Edition Harvest Finished");
}



// Gets items from the endpoint in a batch. Makes calls of a batch size until we have all the objects.
function getBatchEndpoint(uri, transformFunc, cp) {
  var parsedRecords = 0;
  var currPage = cp;

  var getNextBatch = function() {
    return getEndpoint(uri, transformFunc, {page: currPage = currPage+1})
      .then((count) => {
        bot.logger.info("Parsed records: " + parsedRecords);                    
        parsedRecords += count;
        if(count === 10) // If we got less than the batch size that's the last page.
          return getNextBatch()
        else
          return parsedRecords;
      })
      .catch((err) => {
        bot.logger.error(err.toString());
      })
  }

  return getNextBatch();
}

// Fetches from the URL, transforms the results using the transform function, publishes the message.
function getEndpoint(uri, transformFunc, qs) {
  bot.logger.info("Running batch number: " + qs.page);  
  var options = {
    uri: uri + "?page="+qs.page,
    json: true,
    headers: {
      'api-key':config.get('key'), 
    }
  }
  bot.logger.info(JSON.stringify(options));            
  
  return rp(options)
    .then(function(response) {
      var itms = response.response.results;
      itms.forEach((itm) => {
        bot.rabbitPublish(transformFunc(itm));
      })
      return itms.length;
    })
    .catch(function(err) {
      bot.logger.error(err.toString());
    })
}

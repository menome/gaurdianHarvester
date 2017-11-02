/**
 * Holds all the models that are specific to this harvester.
 * These are generally things like mappings, which convert source data into the refinery message schema
 */

/**
 * Holds all the models that are specific to this harvester.
 * These are generally things like mappings, which convert source data into the refinery message schema
 */

var config = require('./config.js');


//////////////////////////////////////
// These are transforms for REST responses.
//////////////////////////////////////
module.exports = {
  tagTransform,
  secTransform
} 

function tagTransform(itm){
  return {
    "Name": itm.webTitle,
    "NodeType":itm.type,
    "SourceSystem": "gaurdianAPI",
    "Priority": 1,
    "ConformedDimensions": {
      "id": itm.id
    },
    "Properties": {
      "webUrl": itm.webUrl,
      "apiUrl": itm.apiUrl
    },
    "Connections":[
      {
        "NodeType": "Section",
        "RelType": "IN_SECTION",
        "ForwardRel": true,
        "ConformedDimensions": {
          "sectionId": itm.sectionId
        },
        "Properties": {
          "name": itm.sectionName
        }
      }
    ]
  }
}


function secTransform(itm){
  msg = {
    "Name": itm.webTitle,
    "NodeType":itm.type,
    "SourceSystem": "gaurdianAPI",
    "Priority": 1,
    "ConformedDimensions": {
      "id": itm.id
    },
    "Properties": {
      "webUrl": itm.webUrl,
      "apiUrl": itm.apiUrl
    },
    "Connections":[]
    
  }
  if(itm.editions){
    itm.editions.forEach(function(edition){
      msg.Connections.push({
        "NodeType": "Edition",
        "RelType": "hasEdition",
        "ForwardRel": true,
        "ConformedDimensions": {
          "OpportunityId": edition.id
        },
        "Properties": {
          "Name":edition.webTitle,
          "webUrl": edition.webUrl,
          "apiUrl": edition.apiUrl
        }
      })
    })
  }
  
  return msg;
}

function edTransform(itm){
  return {
    "Name": itm.webTitle,
    "NodeType":"Edition",
    "SourceSystem": "gaurdianAPI",
    "Priority": 1,
    "ConformedDimensions": {
      "id": itm.id
    },
    "Properties": {
      "webUrl": itm.webUrl,
      "apiUrl": itm.apiUrl,
      "path":itm.path,
      "edition":itm.edition,
      
    },
    "Connections":[
    ]
  }
}
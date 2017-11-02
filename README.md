# TheLink - HarvesterTemplate

This serves as a boilerplate and an example for the data harvester pattern.

This example uses [JsonPlaceholder](https://jsonplaceholder.typicode.com/) as its source system for a REST API, and the mysql World dataset as its source system for a SQL database.

### Usage
This example takes all the data from the JsonPlaceholder API and converts each item to a rabbitMQ message to be consumed by [TheLink:DataRefinery](https://github.com/menome/dataRefinery).

Simply send a POST request to <application root>/sync and the harvester will query the API and start pumping out RMQ messages.

Sending a POST request to <application root>/sqlsync will query the SQL database and start pumping out RMQ messages.

### Example Message Format
```
{
  "Name":"Konrad Aust",
  "NodeType":"Employee",
  "Priority": 1,
  "ConformedDimensions": {
    "Email": "konrad.aust@menome.com",
    "EmployeeId": 12345
  },
  "Properties": {
    "Status":"active"
  },
  "Connections": [
    {
      "Name": "Menome Victoria",
      "NodeType": "Office",
      "RelType": "LocatedInOffice",
      "ForwardRel": true,
      "ConformedDimensions": {
        "City": "Victoria"
      }
    },
    {
      "Name": "theLink",
      "NodeType": "Project",
      "RelType": "WorkedOnProject",
      "ForwardRel": true,
      "ConformedDimensions": {
        "Code": "5"
      }
    }
  ]
}
```

### Configuration

Configuration can be specified either through environment variables, or through a JSON config file, located at config/conf.json.

Environment variables will always overwrite JSON configs. If neither are found, defaults will be loaded.

If your source system requires keys or other things, you'll need to manually add entries for them in the config. The `app/config.js` file should be fairly self explanatory

#### Environment Variables:
```
RABBIT_URL=the URL of the RMQ server. eg. 'amqp://rabbitmq:rabbitmq@rabbit:5672?heartbeat=3600'
DB_HOST=URL of the database
DB_USER=DB Username
DB_PASSWORD=DB Password
DB_NAME=Name of the SQL database on the server.
```

#### Example JSON Configuration:
```
{
  "rabbit": {
    "url": "amqp://rabbitmq:rabbitmq@rabbit:5672?heartbeat=3600",
    "routingKey": "syncevents.harvester.updates",
    "exchange": "syncevents"
  },
  "database": {
    "host": "localhost",
    "user": "root", 
    "password": "password",
    "dbname": "world"
  },
  "apiUrl": "https://jsonplaceholder.typicode.com"
}
```
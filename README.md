Search Engine for OpenSearchServer based on Express and Angular
====================

## Requirements
    1.Angular
    2.Node
    3.OpenSearchServer

## Configuration

Change the config.json file to connect to OpenSearchServer.

    {
        "hostname": "localhost",
        "port":"9090",
        "indexname": "indexname",
        "protocol": "http",
        "login": "documentation",
        "key": "1811b41422a1474a3d91a77a69de7c77"
    }

### Running the app

Runs like a typical express app:

    node app.js

## License
GPL V3
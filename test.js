var oc = require('orthanc-client');
var client = new oc({
    url: 'http://localhost:8042',
    
});

client.instances.getAll()
    .then(function(res) {
        console.log(res);
    })
    .catch(function(err) {
        console.log(err);
    });
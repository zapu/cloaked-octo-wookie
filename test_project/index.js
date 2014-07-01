var request = require('request');
var primes = require('./primes');

postRequest = function(addr, fields, files, cb) {
    var form, key, r, val, _results;
    r = request.post(addr, {
      encoding: null
    }, function(err, res, b) {
      return cb(err, res, b);
    });
    form = r.form();
    for (key in fields) {
      val = fields[key];
      form.append(key, val);
    }
    _results = [];
    for (key in files) {
      val = files[key];
      _results.push(form.append(key, val.data, {
        filename: val.filename
      }));
    }
    return _results;
  };

reportError = function(err) {
	
}

tryWork = function() {
  request('http://192.168.56.1:8090/getWork', workReceived);
}

workReceived = function(err, response, body) {
  if(err) {
    console.log("Failed getting work, retrying");
    return setTimeout(tryWork, 5000);
  }
    

  var workObj = JSON.parse(body);
  doWork(workObj);
}

doWork = function(obj) {
  var result = primes(obj);
  postRequest('http://192.168.56.1:8090/submitWork', {}, 
    { data: 
      { 
        data: JSON.stringify(result),
        filename: 'data'
      }
    }, function() {
      setTimeout(tryWork, 5000);   
    });
}

tryWork();
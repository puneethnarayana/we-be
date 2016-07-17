var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://ah9:ah9@ds021915.mlab.com:21915/ah9';	

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send("Only Back End up here");
});

// we need the fs module for moving the uploaded files
var fs = require('fs');
var randomstring = require("randomstring");

router.post('/saveBase64Image', function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
    var currentDate = new Date().toISOString();
    var path =  "image"+randomstring.generate(5)+".png";
    fs.writeFile(path, base64Data, 'base64', function(err) {
      if (err) throw err;
      console.log('It\'s saved!');
      res.send(path);
    });
});

router.get('/GetCloudSights/:imageName', function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

   var imageName = req.param('imageName');
   console.log(imageName);

   var cloudsight = require ('cloudsight') ({
      apikey: '2RvAvTIFIHoTfZg2slb7cA'
    });

    var image = {
      image: imageName,
      locale: 'en-US'
    };

    // Upload image to analyze, report results
    cloudsight.request (image, true, function(err, data) {
        if (err) {
          console.log (err);
          return;
        }

        console.log (data);
        res.send(data);
      });  
});

router.get('/getVideoText/:videoName', function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

   var videoName = req.param('videoName');
   console.log(videoName);
   var request = require("request");

  var options = { method: 'POST',
    url: 'https://api.havenondemand.com/1/api/async/recognizespeech/v1',
    headers: 
    { 
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data' },
    formData: 
    { file: fs.createReadStream(videoName),
      apikey: '<Secret-Sauce-Key1>' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

   // console.log(body);
    res.send(body);
  });   
});

router.get('/getVideoScenes/:videoName', function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

   var videoName = req.param('videoName');
   console.log(videoName);
   var request = require("request");

  var options = { method: 'POST',
    url: 'https://api.havenondemand.com/1/api/async/detectscenechanges/v1',
    headers: 
    { 
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data' },
    formData: 
    { file: fs.createReadStream(videoName),
      apikey: '<Secret-Sauce-Key1>' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

   // console.log(body);
    res.send(body);
  });   
});

router.get('/getResultByJobID/:jobID', function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

   var jobID = req.param('jobID');
   console.log(jobID);
  var request = require("request");

  var options = { method: 'GET',
    url: 'https://api.havenondemand.com/1/job/result/'+jobID,
    qs: { apikey: '<Secret-Sauce-Key1>' },
    headers: 
    { 'cache-control': 'no-cache',
      'content-type': 'multipart/form-data' }};

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  // console.log(body);
    res.send(body);
}); 
});

router.get('/getSentimentAnalysis/:text', function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

var request = require("request");

var options = { method: 'POST',
  url: 'https://api.havenondemand.com/1/api/sync/analyzesentiment/v1',
  qs: { apikey: '<Secret-Sauce-Key1>' },
  headers: 
   { 
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data' },
  formData: 
   { url: text } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
});


router.post('/getObjectFromS3', function(req, res) {
 res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

var path = require('path');
var s3Url = req.body.url;
//var type =' req.body.type';
var type = 'i';
console.log(req.body);
console.log(s3Url);
var basename = path.basename(s3Url);
basename = type+basename;
//console.log(basename);

 download(s3Url, basename, function(){
      console.log('done');
      if(type=='v'){
           res.send(basename);
      }
      if(type == 'i')
      {
           var cloudsight = require ('cloudsight') ({
            apikey: '<Secret-Sauce-Apikey2>'
          });

          var image = {
            image: basename,
            locale: 'en-US'
          };

          // Upload image to analyze, report results
          cloudsight.request (image, true, function(err, data) {
              if (err) {
                console.log (err);
                return;
              }

              console.log (data);
              res.send(data);
            });  
      }     
    });
});

var fs = require('fs'),
    request = require('request');
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

/* GET Similar Things*/
router.get('/getSimilar/:description', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var description = req.param('description');
  
  var request = require("request");

    var options = { method: 'GET',
      url: 'https://api.havenondemand.com/1/api/sync/findsimilar/v1',
      qs: 
      { text: description,
        total_results: 'false',
        apikey: '<Secret-Sauce-Apikey2>' },
      headers: 
      { 'cache-control': 'no-cache' } };
 
    request(options, function (error, response, body) {
      var superObject = [];
      if (error) throw new Error(error);
      var jsonBody =  JSON.parse(body);
      var resultArray = jsonBody.documents;
      console.log(JSON.stringify(resultArray));
      var arrayLength = resultArray.length;
      console.log(arrayLength);
      var finalObject = [];
      for(var i=0;i<arrayLength;i++)
      {
          var temp = {};
          temp.reference = resultArray[i].reference
          temp.title = resultArray[i].title
          temp.wikipedia_category = resultArray[i].wikipedia_category

          finalObject.push(temp);
      }

      superObject.push(finalObject);

      var options = { method: 'GET',
    url: 'https://api.bestbuy.com/v1/products(name='+description+'*)',
    qs: { format: 'json', apiKey: '<Secret-Sauce-Apikey2>' },
    headers: 
    {      'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

      var pjsonBody =  JSON.parse(body);
       var presultArray = pjsonBody.products;
     // console.log(JSON.stringify(presultArray));
      var arrayLength = presultArray.length;
      console.log(arrayLength);
      var pfinalObject = [];
      for(var i=0;i<arrayLength;i++)
      {
          var temp = {};
          temp.name = presultArray[i].name
          temp.salePrice = presultArray[i].salePrice
          temp.url = presultArray[i].url
          temp.image =  presultArray[i].image

          pfinalObject.push(temp);
      }
      // res.send(pfinalObject);
      // res.send(finalObject);
       superObject.push(pfinalObject);
       console.log(superObject);
       res.send(superObject);
    });
});
});


/* GET Similar Things from Best Buy*/
router.get('/getProducts/:description', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var description = req.param('description');
  
  var request = require("request");

  var options = { method: 'GET',
    url: 'https://api.bestbuy.com/v1/products(name='+description+'*)',
    qs: { format: 'json', apiKey: '<Secret-Sauce-Apikey2>' },
    headers: 
    {      'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

      var pjsonBody =  JSON.parse(body);
       var presultArray = pjsonBody.products;
      console.log(JSON.stringify(presultArray));
      var arrayLength = presultArray.length;
      console.log(arrayLength);
      var pfinalObject = [];
      for(var i=0;i<arrayLength;i++)
      {
          var temp = {};
          temp.name = presultArray[i].name
          temp.salePrice = presultArray[i].salePrice
          temp.url = presultArray[i].url
          temp.thumbnailImage =  presultArray[i].thumbnailImage

          pfinalObject.push(temp);
      }
      res.send(pfinalObject);
  });
});

var setIo = function (IO) {
  console.log("io set");
  publish = true;
  io = IO;
}

module.exports = {
  router: router,
  setIo: setIo
};
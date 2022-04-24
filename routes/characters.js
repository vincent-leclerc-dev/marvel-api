const axios = require('axios');
var crypto = require('crypto');

var express = require('express');
var router = express.Router();

const baseURL = 'https://gateway.marvel.com/v1/public';
const apiPublicKey = process.env.MARVEL_API_PUBLIC_KEY;
const apiPrivateKey = process.env.MARVEL_API_PRIVATE_KEY;

/* GET characters */
router.get('/', function (req, res, next) {

  var timestamp = Date.now();

  var hash = crypto.createHash('md5').update(
    timestamp + apiPrivateKey + apiPublicKey
  ).digest("hex");

  const auth = `&ts=${timestamp}&apikey=${apiPublicKey}&hash=${hash}`;


  let offset = 0;
  if (req.query.offset) {
    offset = req.query.offset;
  }

  let limit = 1;
  if (req.query.limit) {
    limit = req.query.limit;
  }

  let nameStartsWith = '';
  if (req.query.nameStartsWith) {
    nameStartsWith = req.query.nameStartsWith;
  }

  let query = '/characters';
  query += '?offset=' + offset;
  query += '&limit=' + limit;

  if (nameStartsWith != '') {
    query += '&nameStartsWith=' + nameStartsWith;
  }

  const url = `${baseURL}${query}${auth}`;
  axios.get(url)
    .then(function (response) {
      // handle success
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      res.json(error);
    });
});

module.exports = router;

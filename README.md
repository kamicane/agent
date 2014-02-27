# Agent

Agent is a client-side request module inspired by SuperAgent.

## API

### The request object

```js
var agent = require('agent')
var request = agent()
```

Agent can be used by composing methods:

```js
request.method('GET').url('./file').data({x: y}).send(function(error, response) {
  //...
})
```

These methods also act as getters when no parameter is supplied.

Agent can also be used by passing arguments:

```js
var request = agent('GET', './file', {x: y}, function(error, response) {
 //...
})

// defaults to POST
var request = agent('./file', {x: y}, function(error, response) {
 //...
})

// defaults to POST, no data
var request = agent('./file', function(error, response) {
 //...
})
```

You can also mix and match:

```js
var request = agent('./file')

request.send(function(error, response) {
  request.data({x: y}).send(function(error, response) {

  })
})

```

Other methods:

```js
request.header(name, value) // set request header
request.header(name) // get request header
request.header() // get all request header

request.running() // bool
request.abort() // duh
request.user(userName)
request.password("password") // don't use "password" as your password
```

### Encoders, decoders

Agent encodes data you send and decodes data it receives based on content-type.

By default, it encodes and decodes `application/x-www-form-urlencoded` and `application/json` (however an `application/x-www-form-urlencoded` response is not common).

You can add a new response body decoder by doing:

```js
agent.decoder('application/javascript', function(text) {
  return new Function(text); // hemmm
});

request.send(function(error, response) {
  // response.body is a function if the content-type
  // of the response is `application/javascript`
})
```

Or an encoder for data you send:

```js
// This is already in Agent, this is an example
agent.encoder('application/json', JSON.stringify);

request.header('content-type', 'application/json')
// the request will be sent with JSON rather than url encoded.
request.data({a: 1, b: 2}).send(function(...) {

})
```

### The response object

The response obejct you get back when requesting contains a few useful properties:

```js
response.text // response text
response.body // parsed response text based on the content-type header field
response.status // response status
response.header // response header, as an object

// and some added sugar, courtesy of SuperAgent

response.info
response.ok
response.clientError
response.serverError
response.error
response.accepted
response.noContent
response.badRequest
response.unauthorized
response.notAcceptable
response.notFound
```

## Test

Simply run
```
npm test
```

And fire up a browser on `http://localhost:9090`

package: agent
==============

agent is like [superagent](https://github.com/visionmedia/superagent), but less super. It's a small client-side HTTP request lib.

## module: agent

### exports

The agent module exports a function which returns new `Request` objects.

### parameters

1. method - (*string*, optional) The HTTP method for the request. Can be `get`, `post`, `put`, `delete`, `head`, `patch`, or `options`.
2. url - (*string*, optional) The URL to which a request is sent.
3. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
4. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

### sample

```js
// require prime
var agent = require('agent')

var request = agent('get', '/foo', function(err, response){
    console.log('complete!')
})
```

### method agent:get

A shorthand method which returns `get` `Request` objects.

#### syntax

```js
agent.get(url, data, callback)
```

#### parameters

1. url - (*string*, optional) The URL to which a request is sent.
2. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
3. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

#### sample

```js
agent.get('/foo', {}, function(err, response){})
```

### method agent:post

A shorthand method which returns `post` `Request` objects.

#### syntax

```js
agent.post(url, data, callback)
```

#### parameters

1. url - (*string*, optional) The URL to which a request is sent.
2. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
3. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

#### sample

```js
agent.post('/foo', function(err, response){})
```

### method agent:put

A shorthand method which returns `put` `Request` objects.

#### syntax

```js
agent.put(url, data, callback)
```

#### parameters

1. url - (*string*, optional) The URL to which a request is sent.
2. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
3. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

#### sample

```js
agent.put('/foo', function(err, response){})
```

### method agent:delete

A shorthand method which returns `delete` `Request` objects.

#### syntax

```js
agent.delete(url, data, callback)
```

#### parameters

1. url - (*string*, optional) The URL to which a request is sent.
2. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
3. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

#### sample

```js
agent.delete('/foo', function(err, response){})
```

### method agent:head

A shorthand method which returns `head` `Request` objects.

#### syntax

```js
agent.head(url, data, callback)
```

#### parameters

1. url - (*string*, optional) The URL to which a request is sent.
2. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
3. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

#### sample

```js
agent.head('/foo', function(err, response){})
```

### method agent:patch

A shorthand method which returns `patch` `Request` objects.

#### syntax

```js
agent.patch(url, data, callback)
```

#### parameters

1. url - (*string*, optional) The URL to which a request is sent.
2. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
3. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

#### sample

```js
agent.patch('/foo', function(err, response){})
```

### method agent:options

A shorthand method which returns `options` `Request` objects.

#### syntax

```js
agent.options(url, data, callback)
```

#### parameters

1. url - (*string*, optional) The URL to which a request is sent.
2. data - (*mixed*, optional) Data to be sent. It will be encoded into a string if not already.
3. callback - (*function*, optional) The function to be executed upon request completion. It will be passed an `error` and `Response` arguments.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

#### sample

```js
agent.options('/foo', function(err, response){})
```

### method: agent:encoder

Get/set an encoder that is used by the `Request` to encode data before sending.

#### syntax

```js
// set
agent.encoder(ct, encode)

// get
agent.encoder(ct)
```

#### parameters

1. ct - (*string*) Name of the encoder to set/get.
2. encode - (*function*, optional) The function to set.

#### sample

```js
agent.encode('application/html', function(element){
    return element.parentNode.innerHTML
})
```

### method: agent:decoder

Get/set a decoder that is used by the `Response` to decode response data.

#### syntax

```js
// set
agent.decoder(ct, decode)

// get
agent.decoder(ct)
```

#### parameters

1. ct - (*string*) Name of the decoder to set/get.
2. decode - (*function*, optional) The function to set.

#### sample

```js
agent.decode('application/html', function(html){
    var div = document.createElement('div')
    div.innerHTML = html
    return div.childNodes
})
```

## constructor agent.Request

A XMLHttpRequest wrapper returned by `agent`.

### method agent.Request:header

Set/get request header fields.

#### syntax

```js
// set
request.header(name, value)

// get
request.header(name)
```

#### parameters

1. name - (*mixed*) A name (`string`) of the header. An `object` containing name/value pairs of headers to set.
2. value - (*string*, optional) A value to assign.

#### sample

```js
request.header('Last-Modified', 'Sat, 1 Jan 2005 05:00:00 GMT')
```

### method agent.Request:running

Check whether the request is running. Returns `true` if the request is running, otherwise `false`.

#### sample

```js
request.running()
```

### method agent.Request:abort

Abort the currently running request.

#### sample

```js
request.abort()
```

### method agent.Request:method

Set/get the HTTP method for the request.

#### syntax

```js
// set
request.method(m)

// get
request.method()
```

#### parameters

1. m - (*string*, optional) The HTTP method for the request. Can be `get`, `post`, `put`, `delete`, `head`, `patch`, or `options`.

#### sample

```js
request.method('post')

```

### method agent.Request:data

Set/get the data to be sent.

#### syntax

```js
// set
request.data(d)

// get
request.data()
```

#### parameters

1. d - (*mixed*, optional) The data to be sent.

#### sample

```js
request.data({
    foo: 1,
    bar: 2
})
```

### method agent.Request:url

Set/get the URL to which the request is sent.

#### syntax

```js
// set
request.url(u)

// get
request.url()
```

#### parameters

1. u - (*string*, optional) The URL to which a request is sent.

#### sample

```js
request.url('/foo')
```

### method agent.Request:user

Set/get a username used as credentials to authenticate a request.

#### syntax

```js
// set
request.user(u)

// get
request.user()
```

#### parameters

1. u - (*string*, optional) The username used as credentials to authenticate a request

#### sample

```js
request.user('foobar')
```

### method agent.Request:password

Set/get a password used as credentials to authenticate a request.

#### syntax

```js
// set
request.password(p)

// get
request.password()
```

#### parameters

1. p - (*string*, optional) The password used as credentials to authenticate a request

#### sample

```js
request.password('raboof')
```

### method agent.Request:send

Opens the Request connection.

#### syntax

```js
request.send(callback)
```

#### parameters

1. callback - (*function*, optional) The function to be executed upon request completion.

##### parameter: callback

##### syntax

```js
callback(err, response)
```

##### arguments

1. err - (*boolean*) Signify that an error has occurred.
2. response - (*object*) A `Response` object

## constructor agent.Response

A XMLHttpRequest response wrapper passed to the callback of a request.

### property agent.Reponse:text

Unparsed response body string.

### property agent.Reponse:status

Status code from the request response.

### property agent.Reponse:body

Parsed response body string.

### property agent.Reponse:info

Information status code: 1xx.

### property agent.Reponse:ok

Successful status code: 2xx.

### property agent.Reponse:clientError

Client Error status code: 4xx.

### property agent.Reponse:serverError

Server Error status code: 5xx.

### property agent.Reponse:error

Either Client Error or Server Error status codes.

### property agent.Reponse:accepted

Accepted status code: 202.

### property agent.Reponse:noContent

No Content status code: 204 or 1223.

### property agent.Reponse:badRequest

Bad Request status code: 400.

### property agent.Reponse:unauthorized

Unauthorized status code: 401.

### property agent.Reponse:notAcceptable

Not Acceptable status code: 406.

### property agent.Reponse:notFound

Not Found status code: 404.

### method agent.Response:header

Get header fields. Passing a `name` argument returns one header field. No arguments returns an `object` containing all header fields.

#### syntax
```js
response.header(name)
```

#### parameters

1. name - (*mixed*, optional) A name (`string`) of the header field.

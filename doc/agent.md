package: agent
==============

agent is like [superagent](https://github.com/visionmedia/superagent), but less super. It's a small client-side HTTP request lib.

## module: agent

### exports

The agent module exports a function which creates new `Request` objects.

### parameters

1. method - (*string*)
2. url - (*string*)
3. data - (*object*)
4. callback - (*function*)

### sample

```js
// require prime
var agent = require('agent')
```

### method: agent:encoder

placeholder text

#### syntax

```js
agent.encoder(ct, encode)
```

#### parameters

1. ct - (*string*)
2. encode - (*function*)

#### sample

```js
agent.encode('contentType', function(){})
```

### method: agent:decoder

placeholder text

#### syntax

```js
agent.decoder(ct, decode)
```

#### parameters

1. ct - (*string*)
2. decode - (*function*)

#### sample

```js
agent.decode('contentType', function(){})

### method agent:get

placeholder text

#### syntax

```js
agent.get(url, data, callback)
```

#### parameters

1. url - (*string*)
2. data - (*object*)
3. callback - (*function*)


#### sample

```js
agent.get('/', {}, function(){})
```

### method agent:post

placeholder text

#### syntax

```js
agent.post(url, data, callback)
```

#### parameters

1. url - (*string*)
2. data - (*object*)
3. callback - (*function*)


#### sample

```js
agent.post('/', {}, function(){})
```

### method agent:put

placeholder text

#### syntax

```js
agent.put(url, data, callback)
```

#### parameters

1. url - (*string*)
2. data - (*object*)
3. callback - (*function*)


#### sample

```js
agent.put('/', {}, function(){})
```

### method agent:delete

placeholder text

#### syntax

```js
agent.delete(url, data, callback)
```

#### parameters

1. url - (*string*)
2. data - (*object*)
3. callback - (*function*)


#### sample

```js
agent.delete('/', {}, function(){})
```

### method agent:head

placeholder text

#### syntax

```js
agent.head(url, data, callback)
```

#### parameters

1. url - (*string*)
2. data - (*object*)
3. callback - (*function*)


#### sample

```js
agent.head('/', {}, function(){})
```

### method agent:patch

placeholder text

#### syntax

```js
agent.patch(url, data, callback)
```

#### parameters

1. url - (*string*)
2. data - (*object*)
3. callback - (*function*)


#### sample

```js
agent.patch('/', {}, function(){})
```

### method agent:options

placeholder text

#### syntax

```js
agent.options(url, data, callback)
```

#### parameters

1. url - (*string*)
2. data - (*object*)
3. callback - (*function*)


#### sample

```js
agent.options('/', {}, function(){})
```

## module agent.Request

placeholder text

#### syntax

```js
new agent.Request()
```

#### sample

```js
new agent.Request()
```

### method agent.Request:header

### method agent.Request:running

### method agent.Request:abort

### method agent.Request:method

### method agent.Request:data

### method agent.Request:url

### method agent.Request:user

### method agent.Request:password

### method agent.Request:send

## module agent.Response

placeholder text

#### syntax

```js
new agent.Response(text, status, header)
```

#### parameters

1. text - (*string*)
2. status - (*number*)
3. header - (*object*)

#### sample

```js
new agent.Response('text', 200, {})
```

### method agent.Response:header
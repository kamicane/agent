/*
Agent
- heavily inspired by superagent by visionmedia https://github.com/visionmedia/superagent, released under the MIT license
- code derived from MooTools 1.4 Request.js && superagent
- MIT-License
*/"use strict";
/* global ActiveXObject */

var prime   = require("prime"),
    Emitter = require("prime/emitter")

var isObject   = require("mout/lang/isObject"),
    isString   = require("mout/lang/isString"),
    isArray    = require("mout/lang/isArray"),
    isFunction = require("mout/lang/isFunction"),
    trim       = require("mout/string/trim"),
    upperCase  = require("mout/string/upperCase"),
    forIn      = require("mout/object/forIn"),
    mixIn      = require("mout/object/mixIn"),
    remove     = require("mout/array/remove"),
    forEach    = require("mout/array/forEach")

var capitalize = function(str){
    return str.replace(/\b[a-z]/g, upperCase)
}

// MooTools

var getRequest = (function(){

    var XMLHTTP = function(){
        return new XMLHttpRequest()
    }, MSXML2 = function(){
        return new ActiveXObject("MSXML2.XMLHTTP")
    }, MSXML = function(){
        return new ActiveXObject("Microsoft.XMLHTTP")
    }

    try {
      XMLHTTP()
      return XMLHTTP
    } catch(e){}
    try {
        MSXML2()
        return MSXML2
    } catch(e){}
    try {
        MSXML()
        return MSXML
    } catch(e){}

    return null

})()

var encodeJSON = function(object){
    if (object == null) return ""
    if (object.toJSON) return object.toJSON()
    return JSON.stringify(object)
}

// MooTools

var encodeQueryString = function(object, base){

    if (object == null) return ""
    if (object.toQueryString) return object.toQueryString()

    var queryString = []

    forIn(object, function(value, key){
        if (base) key = base + "[" + key + "]"
        var result

        if (value == null) return

        if (isArray(value)){
            var qs = {}
            for (var i = 0; i < value.length; i++) qs[i] = value[i]
            result = encodeQueryString(qs, key)
        } else if (isObject(value)){
            result = encodeQueryString(value, key)
        } else {
            result = key + "=" + encodeURIComponent(value)
        }

        queryString.push(result)
    })

    return queryString.join("&")

}

var decodeJSON = JSON.parse

// decodeQueryString by Brian Donovan
// http://stackoverflow.com/users/549363/brian-donovan

var decodeQueryString = function(params){

    var pairs  = params.split('&'),
        result = {}

    for (var i = 0; i < pairs.length; i++){

        var pair      = pairs[i].split('='),
            key       = decodeURIComponent(pair[0]),
            value     = decodeURIComponent(pair[1]),
            isArray   = /\[\]$/.test(key),
            dictMatch = key.match(/^(.+)\[([^\]]+)\]$/)

        if (dictMatch){
            key = dictMatch[1]
            var subkey = dictMatch[2]

            result[key] = result[key] || {}
            result[key][subkey] = value
        } else if (isArray){
            key = key.substring(0, key.length - 2)
            result[key] = result[key] || []
            result[key].push(value)
        } else {
            result[key] = value
        }

    }

    return result

}

var encoders = {
    "application/json" : encodeJSON,
    "application/x-www-form-urlencoded" : encodeQueryString
}

var decoders = {
    "application/json": decodeJSON,
    "application/x-www-form-urlencoded": decodeQueryString
}

// parseHeader from superagent
// https://github.com/visionmedia/superagent
// MIT

var parseHeader = function(str){
    var lines = str.split(/\r?\n/), fields = {}

    lines.pop() // trailing CRLF

    for (var i = 0, l = lines.length; i < l; ++i){
        var line  = lines[i],
            index = line.indexOf(':'),
            field = capitalize(line.slice(0, index)),
            value = trim(line.slice(index + 1))

        fields[field] = value
    }

    return fields
}

var REQUESTS = 0, Q = [] // Queue stuff

var Request = prime({

    constructor: function Request(){
        this._header = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    },

    header: function(name, value){
        if (isObject(name)) for (var key in name) this.header(key, name[key])
        else if (!arguments.length) return this._header
        else if (arguments.length === 1) return this._header[capitalize(name)]
        else if (arguments.length === 2){
            if (value == null) delete this._header[capitalize(name)]
            else this._header[capitalize(name)] = value
        }
        return this
    },

    running: function(){
        return !!this._running
    },

    abort: function(){

        if (this._queued){
            remove(Q, this._queued)
            delete this._queued
        }

        if (this._xhr){
            this._xhr.abort()
            this._end()
        }

        return this
    },

    method: function(m){
        if (!arguments.length) return this._method
        this._method = m.toUpperCase()
        return this
    },

    data: function(d){
        if (!arguments.length) return this._data
        this._data = d
        return this
    },

    url: function(u){
        if (!arguments.length) return this._url
        this._url = u
        return this
    },

    user: function(u){
        if (!arguments.length) return this._user
        this._user = u
        return this
    },

    password: function(p){
        if (!arguments.length) return this._password
        this._password = p
        return this
    },

    _send: function(method, url, data, header, user, password, callback){
        var self = this

        if (REQUESTS === agent.MAX_REQUESTS) return Q.unshift(this._queued = function(){
            delete self._queued
            self._send(method, url, data, header, user, password, callback)
        })

        REQUESTS++

        var xhr = this._xhr = agent.getRequest()

        if (xhr.addEventListener) forEach(['progress', 'load', 'error' , 'abort', 'loadend'], function(method){
            xhr.addEventListener(method, function(event){
                self.emit(method, event)
            }, false)
        })

        xhr.open(method, url, true, user, password)
        if (user != null && "withCredentials" in xhr) xhr.withCredentials = true

        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4){
                var status = xhr.status
                var response = new Response(xhr.responseText, status, parseHeader(xhr.getAllResponseHeaders()))
                var error = response.error ? new Error(method + " " + url + " " + status) : null
                self._end()
                callback(error, response)
            }
        }

        for (var field in header) xhr.setRequestHeader(field, header[field])
        xhr.send(data || null)
    },

    _end: function(){
        this._xhr.onreadystatechange = function(){}

        delete this._xhr
        delete this._running

        REQUESTS--

        var queued = Q.pop()
        if (queued) queued()
    },

    send: function(callback){
        if (this._running) this.abort()
        this._running = true

        if (!callback) callback = function(){}

        var method   = this._method || "POST",
            data     = this._data || null,
            url      = this._url,
            user     = this._user || null,
            password = this._password || null

        if (data && !isString(data)){
            var contentType = this._header['Content-Type'].split(/ *; */).shift(),
                encode      = encoders[contentType]
            if (encode) data = encode(data)
        }

        if (/GET|HEAD/.test(method) && data) url += (url.indexOf("?") > -1 ? "&" : "?") + data

        var header = mixIn({}, this._header);

        this._send(method, url, data, header, user, password, callback)

        return this

    }

})

Request.implement(new Emitter)

var Response = prime({

    constructor: function Response(text, status, header){

        this.text   = text
        this.status = status

        this.header = header

        // statuses from superagent
        // https://github.com/visionmedia/superagent
        // MIT

        var t = status / 100 | 0

        this.info        = t === 1
        this.ok          = t === 2
        this.clientError = t === 4
        this.serverError = t === 5
        this.error       = t === 4 || t === 5
        var length = '' + header['Content-Length']

        // sugar
        this.accepted      = status === 202
        this.noContent     = length === '0' || status === 204 || status === 1223
        this.badRequest    = status === 400
        this.unauthorized  = status === 401
        this.notAcceptable = status === 406
        this.notFound      = status === 404

        var contentType = header['Content-Type'] ? header['Content-Type'].split(/ *; */).shift() : '',
            decode

        if (!this.noContent) decode = decoders[contentType]

        this.body = decode ? decode(this.text) : this.text

    }

})

var methods  = "get|post|put|delete|head|patch|options",
    rMethods = new RegExp("^" + methods + "$", "i")

var agent = function(method, url, data, callback){
    var request = new Request()

    if (!arguments.length) return request

    if (!rMethods.test(method)){ // shift
        callback = data
        data     = url
        url      = method
        method   = "post"
    }

    if (isFunction(data)){
        callback = data
        data = null
    }

    request.method(method)

    if (url) request.url(url)
    if (data) request.data(data)
    if (callback) request.send(callback)

    return request
}

agent.encoder = function(ct, encode){
    if (arguments.length === 1) return encoders[ct]
    encoders[ct] = encode
    return agent
}

agent.decoder = function(ct, decode){
    if (arguments.length === 1) return decoders[ct]
    decoders[ct] = decode
    return agent
}

forEach(methods.split("|"), function(method){
    agent[method] = function(url, data, callback){
        return agent(method, url, data, callback)
    }
})

agent.MAX_REQUESTS = Infinity
agent.getRequest = getRequest
agent.Request  = Request
agent.Response = Response

module.exports = agent

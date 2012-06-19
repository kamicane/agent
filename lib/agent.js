/*
Agent
- heavily inspired by superagent by visionmedia https://github.com/visionmedia/superagent, released under the MIT license
- code derived from MooTools 1.4 Request.js && superagent
- MIT-License
 */"use strict"

var prime  = require("prime"),
    array  = require("prime/es5/array"),
    string = require("prime/types/string")

var trim       = string.trim,
    capitalize = string.capitalize

// MooTools

var getRequest = (function(){
    var XMLHTTP = function(){
        return new XMLHttpRequest()
    }, MSXML2 = function(){
        return new ActiveXObject("MSXML2.XMLHTTP")
    }, MSXML = function(){
        return new ActiveXObject("Microsoft.XMLHTTP")
    }
    try {XMLHTTP(); return XMLHTTP} catch(e){}
    try {MSXML2(); return MSXML2} catch(e){}
    try {MSXML(); return MSXML} catch(e){}
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

    for (var key in object) (function(key, value){
        if (base) key = base + "[" + key + "]"
        var result

        if (value == null) return

        if (array.isArray(value)){
            var qs = {}
            for (var i = 0; i < value.length; i++) qs[i] = value[i]
            result = encodeQueryString(qs, key)
        } else if (typeof value === "object"){
            result = encodeQueryString(value, key)
        } else {
            result = key + "=" + encodeURIComponent(value)
        }

        queryString.push(result)

    })(key, object[key])

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

var types = {
    "json": "application/json",
    "urlencoded": "application/x-www-form-urlencoded"
}

// parseHeader from superagent
// https://github.com/visionmedia/superagent
// MIT

var parseHeader = function(str){
    var lines = str.split(/\r?\n/), fields = {}

    lines.pop(); // trailing CRLF

    for (var i = 0, l = lines.length; i < l; ++i){
        var line  = lines[i],
            index = line.indexOf(':'),
            field = capitalize(line.slice(0, index)),
            value = trim(line.slice(index + 1))

        fields[field] = value
    }

    return fields
}

var Request = prime({

    constructor: function Request(){
        this._xhr = getRequest()
        this._header = {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    },

    type: function(type){
        return this.header("Content-Type", types[type] || type);
    },

    header: function(name, value){
        if (typeof name === "object") for (var key in name) this.header(key, name[key])
        else if (arguments.length === 2) this._header[capitalize(name)] = value
        else if (arguments.length === 1) return this._header[capitalize(name)]
        else if (!arguments.length) return this._header
        return this
    },

    running: function(){
        return !!this._running
    },

    abort: function(){
        if (this._running){
            this._xhr.abort()
            delete this._running
            this._xhr.onreadystatechange = function(){}
            this._xhr = getRequest()
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
        if (this._method !== "GET" && typeof d !== 'string') this.type('json');
        if (typeof d === typeof this._data){
            if (array.isArray(d)) array.every(d, function(x){ return this.push(x) }, this._data)
            else for (var x in d) this._data[x] = d[x]
        } else {
            this._data = d
        }
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

    send: function(callback){

        if (!callback) callback = function(){}

        if (this._running) this.abort()
        this._running = true

        var method   = this._method || "POST",
            data     = this._data || "",
            url      = this._url,
            user     = this._user || null,
            password = this._password || null

        var self = this, xhr = this._xhr

        if (typeof data !== "string"){
            var type   = (this._header['Content-Type'] || '').split(/ *; */).shift(),
                encode = encoders[type]
            if (encode) data = encode(data)
        }

        if (method === "GET"){
            url += (url.indexOf("?") > -1 ? "&" : "?") + data
            data = null
        }

        xhr.open(method, url, true, user, password)
        if (user != null && "withCredentials" in xhr) xhr.withCredentials = true

        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4){
                self._running = false
                xhr.onreadystatechange = function(){}
                callback(new Response(xhr.responseText, xhr.status, parseHeader(xhr.getAllResponseHeaders())))
            }
        }

        for (var field in this._header) xhr.setRequestHeader(field, this._header[field])

        xhr.send(data)
        this._data = null

        return this

    }

})

var Response = prime({

    constructor: function Response(text, status, header){

        this.text = text
        this.status = status

        var type   = (header['Content-Type'] || '').split(/ *; */).shift(),
            decode = decoders[type]

        this.body = decode ? decode(this.text) : this.text

        this._header = header

        // statuses from superagent
        // https://github.com/visionmedia/superagent
        // MIT

        var t = status / 100 | 0

        this.info        = t === 1
        this.ok          = t === 2
        this.clientError = t === 4
        this.serverError = t === 5
        this.error       = t === 4 || t === 5

        // sugar
        this.accepted      = status === 202
        this.noContent     = status === 204 || status === 1223
        this.badRequest    = status === 400
        this.unauthorized  = status === 401
        this.notAcceptable = status === 406
        this.notFound      = status === 404

    },

    header: function(name){
        return (name) ? this._header[capitalize(name)] : null
    }

})

var methods  = "get|post|put|delete|head|patch",
    rMethods = RegExp("^" + methods + "$", "i")

var agent = function(method, url, data, callback){
    var request = new Request()

    if (!rMethods.test(method)){ // shift
        callback = data
        data = url
        url = method
        method = "post"
    }

    if (typeof data === "function"){
        callback = data
        data = null
    }

    request.method(method)

    if (url) request.url(url)
    if (data) request.data(data)
    if (callback) request.send(callback)

    return request
}

agent.encode = function(ct, encode){
    if (arguments.length === 1) return encoders[ct]
    encoders[ct] = encode
    return agent
}

agent.decode = function(ct, decode){
    if (arguments.length === 1) return decoders[ct]
    decoders[ct] = decode
    return agent
}

array.forEach(methods.split("|"), function(method){
    agent[method] = function(url, data, callback){
        return agent(method, url, data, callback)
    }
})

module.exports = agent

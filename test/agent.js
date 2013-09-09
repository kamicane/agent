"use strict";
/*
 Credit @ visionmedia / superagent
 https://github.com/visionmedia/superagent/blob/master/test/test.request.js
 */
var agent = require('../index')
var expect = require('expect.js')
describe('agent.js', function(){
    // prepare the environment
    beforeEach(function(){
    })
    /*

     // Request, Response is not exposed (should be?).
     //it('Request inheritance', function(){
     //  expect(request.get('/') instanceof request.Request);
     //  expect(request.get('/') instanceof EventEmitter);
     //});

     //type,charset in Response not implemented-
     //it('GET .type', function(next){
     //  request
     //  .get('/pets')
     //  .send(function(res){
     //    expect('application/json' == res.type);
     //    next();
     //  });
     //});
     //
     //
     //it('GET Content-Type params', function(next){
     //  request
     //  .get('/pets')
     //  .send(function(res){
     //    expect('utf-8' == res.charset);
     //    next();
     //  });
     //});
     */

    describe('agent', function(){

        it('should handle simple GET without callback', function(){
            agent('GET', '/test/agent.js').send();
        })

        it('should handle simple GET', function(){
            agent('GET', '/test/agent.js').send(function(res){
                //expect(res instanceof request.Response, 'respond with Response');
                expect(res.ok).to.be.ok()
                expect(res.text != null).to.be.ok()
            });
        })

        it('should handle simple HEAD', function(){
            agent.head('/test/agent.js').send(function(res){
                //expect(res instanceof request.Response, 'respond with Response');
                expect(res.ok).to.be.ok()
                expect(res.text).to.be('')
            })
        })

        it('should handle GET 5xx', function(){
            agent('GET', '/error').send(function(res){
                expect(res.ok).to.not.be.ok()
                expect(res.error).to.be.ok()
                expect(res.clientError).to.not.be.ok()
                expect(res.serverError).to.be.ok()
            })
        })

        it('should handle GET 4xx', function(){
            agent('GET', '/notfound').send(function(res){
                expect(res.ok).to.not.be.ok()
                expect(res.error).to.be.ok()
                expect(res.clientError).to.be.ok()
                expect(res.serverError).to.not.be.ok()
            })
        })

        it('should handle GET 404 Not Found', function(){
            agent('GET', '/notfound').send(function(res){
                expect(res.notFound).to.be.ok()
            })
        })

        it('should handle GET 400 Bad Request', function(){
            agent('GET', '/bad-request').send(function(res){
                expect(res.badRequest).to.be.ok()
            })
        })

        it('should handle GET 401 Bad Request', function(){
            agent('GET', '/unauthorized').send(function(res){
                expect(res.unauthorized).to.be.ok()
            })
        })

        it('should handle GET 406 Not Acceptable', function(){
            agent('GET', '/not-acceptable').send(function(res){
                expect(res.notAcceptable).to.be.ok()
            })
        })

        it('should handle GET 204 No Content', function(){
            agent('GET', '/no-content').send(function(res){
                expect(res.noContent).to.be.ok()
            })
        })

        it('should handle header parsing', function(){
            agent('GET', '/notfound').send(function(res){
                expect(res._header['Content-Type']).to.be('text/plain');
                expect(res._header['X-Powered-By']).to.be('Express');
            })
        })

        it('should handle .status', function(){
            agent('GET', '/notfound').send(function(res){
                expect(404 == res.status, 'response .status');
                //expect(4 == res.statusType, 'response .statusType');
            })
        })

        it('should handle get()', function(){
            agent.get('/notfound').send(function(res){
                expect(res.status).to.be(404)
                //expect(4 == res.statusType, 'response .statusType');
            })
        })

        it('should handle patch()', function(){
            agent.patch('/user/12').send(function(res){
                expect(res.text).to.be('updated')
            })
        })

        it('should handle put()', function(){
            agent.put('/user/12').send(function(res){
                expect(res.text).to.be('updated')
            })
        })

        it('should handle post()', function(){
            agent.post('/user').send(function(res){
                expect(res.text).to.be('created')
            })
        })

        it('should handle del()', function(){
            agent.delete('/user/12').send(function(res){
                expect(res.text).to.be('deleted')
            })
        })

        it('should handle post() data', function(){
            agent.post('/todo/item').data('tobi').send(function(res){
                expect(res.text).to.be('added "tobi"')
            })
        })
        /*
        it('should handle .type()', function(){
            agent
                .post('/user/12/pet')
                .type('urlencoded')
                .data('pet=tobi')
                .send(function(res){
                    expect(res.text).to.be('added pet "tobi"')
                })
        })

        it('should handle .type() with alias', function(){
            agent
                .post('/user/12/pet')
                .type('application/x-www-form-urlencoded')
                .data('pet=tobi')
                .send(function(res){
                    expect(res.text).to.be('added pet "tobi"')
                })
        })
        */
        it('should handle .get() with no data or callback', function(){
            agent.get('/echo-header/content-type')
        })

        it('should handle .send() with no data only', function(){
            agent.post('/user/5/pet').header('Content-Type','application/x-www-form-urlencoded').data('pet=tobi').send()
        })

        it('should handle .send() with callback only', function(){
            agent
                .get('/echo-header/accept')
                .header('Accept', 'foo/bar')
                .send(function(res){
                    expect(res.text).to.be('foo/bar')
                })
        })

        // FIXME: ie6 will POST rather than GET here due to data(),
        //        but I'm not 100% sure why.  Newer IEs are OK.
        // <kentaromiura> I should test but I think that we don't have this problem ^.

        it('should handle .send()', function(){
            agent
                .get('/echo-header/content-type')
                .header('Content-Type', 'text/plain')
                .data('wahoo')
                .send(function(res){
                    expect(res.text).to.be('text/plain')
                })
        })

        it('should handle .header()', function(){
            agent
                .get('/echo-header/content-type')
                .header('Content-Type', 'text/plain')
                .data('wahoo')
                .send(function(res){
                    expect(res.text).to.be('text/plain')
                })
        })

        it('should handle .header(object)', function(){
            agent
                .get('/echo-header/content-type')
                .header({ 'Content-Type': 'text/plain' })
                .data('wahoo')
                .send(function(res){
                    expect(res.text).to.be('text/plain')
                })
        })

        it('should handle POST urlencoded', function(){
            agent
                .post('/pet')
                .header('Content-Type', 'application/x-www-form-urlencoded')
                .data({ name: 'Manny', species: 'cat' })
                .send(function(res){
                    expect(res.text).to.be('added Manny the cat')
                })
        })

        it('should handle POST json', function(){
            agent
                .post('/pet')
                .header('Content-Type', 'application/json')
                .data({ name: 'Manny', species: 'cat' })
                .send(function(res){
                    expect(res.text).to.be('added Manny the cat')
                })
        })
        /*
        it('should handle POST json array', function(){
            agent
                .post('/echo')
                .data([1, 2, 3])
                .send(function(res){
                    expect(res._header['Content-Type']).to.be('application/json; charset=utf-8')
                    expect(res.text).to.be('[1,2,3]')
                })
        })

        it('should handle POST multiple json array', function(){
            agent
                .post('/echo')
                .data([1, 2, 3])
                .data([4, 5, 6])
                .send(function(res){
                    expect(res._header['Content-Type']).to.be('application/json; charset=utf-8')
                    expect(res.text).to.be('[1,2,3,4,5,6]')
                })
        })

        it('should handle POST json default', function(){
            agent
                .post('/pet')
                .data({ name: 'Manny', species: 'cat' })
                .send(function(res){
                    expect(res.text).to.be('added Manny the cat')
                })
        })

        it('should handle POST multiple .data() calls', function(){
            var current = agent
                .post('/pet')
                .data({ name: 'Manny' })
                .data({ species: 'cat' })
                .send(function(res){
                    expect(res.text).to.be('added Manny the cat')
                })
            expect(current._data).to.be(null);
        })
        */

        it('should handle GET json', function(){
            agent
                .get('/pets')
                .send(function(res){
                    var expected = ['tobi', 'loki', 'jane']

                    for (var i = 0, max = res.body.length; i < max; i++){
                        expect(res.body[i]).to.be(expected[i])
                    }
                })
        })

        it('should handle GET x-www-form-urlencoded', function(){
            agent
                .get('/foo')
                .send(function(res){
                    expect(res.body.foo).to.be('bar')
                })
        })

        it('should handle GET shorthand', function(){
            agent.get('/foo', function(res){
                expect(res.text).to.be('foo=bar')
            })
        })

        it('should handle POST shorthand', function(){
            agent.post('/user/0/pet', { pet: 'tobi' }, function(res){
                expect(res.text).to.be('added pet "tobi"')
            })
        })

        it('should handle POST shorthand without callback', function(){
            agent.post('/user/0/pet', { pet: 'tobi' }).send(function(res){
                expect(res.text).to.be('added pet "tobi"')
            })
        })

        it('should handle request X-Requested-With', function(){
            agent
                .get('/echo-header/x-requested-with')
                .send(function(res){
                    expect(res.text).to.be('XMLHttpRequest')
                })
        })
        /*
        it('should handle GET querystring object', function(){
            agent
                .get('/querystring')
                .data({ search: 'Manny' })
                .send(function(res){
                    expect(res.body.search).to.be('Manny')
                })
        })
        */
        it('should handle GET querystring append original', function(){
            agent
                .get('/querystring?search=Manny')
                .data({ range: '1..5' })
                .send(function(res){
                    expect(res.body.search).to.be('Manny')
                    expect(res.body.range).to.be('1..5')
                })
        })
        /*
        it('should handle GET querystring multiple objects', function(){
            agent
                .get('/querystring')
                .data({ search: 'Manny' })
                .data({ range: '1..5' })
                .data({ order: 'desc' })
                .send(function(res){
                    expect(res.body.search).to.be('Manny')
                    expect(res.body.range).to.be('1..5')
                    expect(res.body.order).to.be('desc')
                })
        })
        */
        it('should handle GET querystring object .get(uri, obj)', function(){
            agent
                .get('/querystring', { search: 'Manny' })
                .send(function(res){
                    expect(res.body.search).to.be('Manny')
                })
        })

        it('should handle GET querystring object .get(uri, obj, fn)', function(){
            agent.get('/querystring', { search: 'Manny'}, function(res){
                expect(res.body.search).to.be('Manny')
            })
        })

        it('should handle request(method, url)', function(){
            agent('GET', '/foo').send(function(res){
                expect(res.body.foo).to.be('bar')
            })
        })

        it('should handle request(url)', function(){
            agent.get('/foo').send(function(res){
                expect(res.body.foo).to.be('bar')
            })
        })

        it('should handle request(url, fn)', function(){
            agent.get('/foo', function(res){
                expect(res.body.foo).to.be('bar')
            })
        })

    })
})

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

        it('should handle simple GET without callback', function(done){
            agent('GET', '/test/agent.js').send();
            done();
        })

        it('should handle simple GET', function(done){
            agent('GET', '/test/agent.js').send(function(err, res){
                //expect(res instanceof request.Response, 'respond with Response');
                expect(res.ok).to.be.ok()
                expect(res.text != null).to.be.ok()
                done();
            });
        })

        it('should handle simple HEAD', function(done){
            agent.head('/test/agent.js').send(function(err, res){
                //expect(res instanceof request.Response, 'respond with Response');
                expect(res.ok).to.be.ok()
                expect(res.text).to.be('')
                done();
            })
        })

        it('should handle GET 5xx', function(done){
            agent('GET', '/error').send(function(err, res){
                expect(res.ok).to.not.be.ok()
                expect(res.error).to.be.ok()
                expect(res.clientError).to.not.be.ok()
                expect(res.serverError).to.be.ok()
                done();
            })
        })

        it('should handle GET 4xx', function(done){
            agent('GET', '/notfound').send(function(err, res){
                expect(res.ok).to.not.be.ok()
                expect(res.error).to.be.ok()
                expect(res.clientError).to.be.ok()
                expect(res.serverError).to.not.be.ok()
                done();
            })
        })

        it('should handle GET 404 Not Found', function(done){
            agent('GET', '/notfound').send(function(err, res){
                expect(res.notFound).to.be.ok()
                done();
            })
        })

        it('should handle GET 400 Bad Request', function(done){
            agent('GET', '/bad-request').send(function(err, res){
                expect(res.badRequest).to.be.ok()
                done();
            })
        })

        it('should handle GET 401 Bad Request', function(done){
            agent('GET', '/unauthorized').send(function(err, res){
                expect(res.unauthorized).to.be.ok()
                done();
            })
        })

        it('should handle GET 406 Not Acceptable', function(done){
            agent('GET', '/not-acceptable').send(function(err, res){
                expect(res.notAcceptable).to.be.ok()
                done();
            })
        })

        it('should handle GET 204 No Content', function(done){
            agent('GET', '/no-content').send(function(err, res){
                expect(res.noContent).to.be.ok()
                done();
            })
        })

        it('should handle Content-Length = 0', function(done){
            agent('GET', '/ok-but-no-content').send(function(err, res){
                expect(res.ok).to.be.ok()
                expect(res.noContent).to.be.ok()
                done()
            })
        })

        it('should handle header parsing', function(done){
            agent('GET', '/text-plain').send(function(err, res){
                expect(res.header['Content-Type']).to.be('text/plain');
                expect(res.header['X-Powered-By']).to.be('Express');
                done();
            })
        })

        it('should handle .status', function(done){
            agent('GET', '/notfound').send(function(err, res){
                expect(404 == res.status, 'response .status');
                //expect(4 == res.statusType, 'response .statusType');
                done();
            })
        })

        it('should handle get()', function(done){
            agent.get('/notfound').send(function(err, res){
                expect(res.status).to.be(404)
                //expect(4 == res.statusType, 'response .statusType');
                done();
            })
        })

        it('should handle patch()', function(done){
            agent.patch('/user/12').send(function(err, res){
                expect(res.text).to.be('updated')
                done();
            })
        })

        it('should handle put()', function(done){
            agent.put('/user/12').send(function(err, res){
                expect(res.text).to.be('updated')
                done();
            })
        })

        it('should handle post()', function(done){
            agent.post('/user').send(function(err, res){
                expect(res.text).to.be('created')
                done();
            })
        })

        it('should handle delete()', function(done){
            agent['delete']('/user/12').send(function(err, res){
                expect(res.text).to.be('deleted')
                done();
            })
        })

        it('should handle post() data', function(done){
            agent.post('/todo/item').data('tobi').send(function(err, res){
                expect(res.text).to.be('added "tobi"')
                done();
            })
        })
        /*
        it('should handle .type()', function(){
            agent
                .post('/user/12/pet')
                .type('urlencoded')
                .data('pet=tobi')
                .send(function(err, res){
                    expect(res.text).to.be('added pet "tobi"')
                })
        })

        it('should handle .type() with alias', function(){
            agent
                .post('/user/12/pet')
                .type('application/x-www-form-urlencoded')
                .data('pet=tobi')
                .send(function(err, res){
                    expect(res.text).to.be('added pet "tobi"')
                })
        })
        */
        // it('should handle .get() with no data or callback', function(done){
        //     agent.get('/echo-header/content-type')
        // })

        // it('should handle .send() with no data only', function(){
        //     agent.post('/user/5/pet').header('Content-Type','application/x-www-form-urlencoded').data('pet=tobi').send()
        // })

        it('should handle .send() with callback only', function(done){
            agent
                .get('/echo-header/accept')
                .header('Accept', 'foo/bar')
                .send(function(err, res){
                    expect(res.text).to.be('foo/bar')
                    done();
                })
        })

        // FIXME: ie6 will POST rather than GET here due to data(),
        //        but I'm not 100% sure why.  Newer IEs are OK.
        // <kentaromiura> I should test but I think that we don't have this problem ^.

        it('should handle .send()', function(done){
            agent
                .get('/echo-header/content-type')
                .header('Content-Type', 'text/plain')
                .data('wahoo')
                .send(function(err, res){
                    expect(res.text).to.be('text/plain')
                    done();
                })
        })

        it('should handle .header()', function(done){
            agent
                .get('/echo-header/content-type')
                .header('Content-Type', 'text/plain')
                .data('wahoo')
                .send(function(err, res){
                    expect(res.text).to.be('text/plain')
                    done();
                })
        })

        it('should handle .header(object)', function(done){
            agent
                .get('/echo-header/content-type')
                .header({ 'Content-Type': 'text/plain' })
                .data('wahoo')
                .send(function(err, res){
                    expect(res.text).to.be('text/plain')
                    done();
                })
        })

        it('should handle POST urlencoded', function(done){
            agent
                .post('/pet')
                .header('Content-Type', 'application/x-www-form-urlencoded')
                .data({ name: 'Manny', species: 'cat' })
                .send(function(err, res){
                    expect(res.text).to.be('added Manny the cat')
                    done();
                })
        })

        it('should handle POST json', function(done){
            agent
                .post('/pet')
                .header('Content-Type', 'application/json')
                .data({ name: 'Manny', species: 'cat' })
                .send(function(err, res){
                    expect(res.text).to.be('added Manny the cat')
                    done();
                })
        })

        it('should not throw when noContent 204/1223 sent', function(done){
            agent
                ['delete']('/no-content/')
                .header('Content-Type', 'application/json')
                .data({ id: 1 })
                .send(function(err, res){
                    expect(res.text).to.be('')
                    done();
                })
        })
        /*
        it('should handle POST json array', function(){
            agent
                .post('/echo')
                .data([1, 2, 3])
                .send(function(err, res){
                    expect(res.header['Content-Type']).to.be('application/json; charset=utf-8')
                    expect(res.text).to.be('[1,2,3]')
                })
        })

        it('should handle POST multiple json array', function(){
            agent
                .post('/echo')
                .data([1, 2, 3])
                .data([4, 5, 6])
                .send(function(err, res){
                    expect(res.header['Content-Type']).to.be('application/json; charset=utf-8')
                    expect(res.text).to.be('[1,2,3,4,5,6]')
                })
        })

        it('should handle POST json default', function(){
            agent
                .post('/pet')
                .data({ name: 'Manny', species: 'cat' })
                .send(function(err, res){
                    expect(res.text).to.be('added Manny the cat')
                })
        })

        it('should handle POST multiple .data() calls', function(){
            var current = agent
                .post('/pet')
                .data({ name: 'Manny' })
                .data({ species: 'cat' })
                .send(function(err, res){
                    expect(res.text).to.be('added Manny the cat')
                })
            expect(current._data).to.be(null);
        })
        */

        it('should handle GET json', function(done){
            agent
                .get('/pets')
                .header('Content-Type', 'application/json')
                .send(function(err, res){
                    var expected = ['tobi', 'loki', 'jane']
                    for (var i = 0, max = res.body.length; i < max; i++){
                        expect(res.body[i]).to.be(expected[i])
                    }
                    done();
                })
        })

        it('should handle GET x-www-form-urlencoded', function(done){
            agent
                .get('/foo')
                .send(function(err, res){
                    expect(res.body.foo).to.be('bar')
                    done();
                })
        })

        it('should handle GET shorthand', function(done){
            agent.get('/foo', function(err, res){
                expect(res.text).to.be('foo=bar')
                done();
            })
        })

        it('should handle POST shorthand', function(done){
            agent.post('/user/0/pet', { pet: 'tobi' }, function(err, res){
                expect(res.text).to.be('added pet "tobi"')
                done();
            })
        })

        it('should handle POST shorthand without callback', function(done){
            agent.post('/user/0/pet', { pet: 'tobi' }).send(function(err, res){
                expect(res.text).to.be('added pet "tobi"')
                done();
            })
        })

        // it('should handle request X-Requested-With', function(){
        //     agent
        //         .get('/echo-header/x-requested-with')
        //         .send(function(err, res){
        //             expect(res.text).to.be('XMLHttpRequest')
        //         })
        // })
        /*
        it('should handle GET querystring object', function(){
            agent
                .get('/querystring')
                .data({ search: 'Manny' })
                .send(function(err, res){
                    expect(res.body.search).to.be('Manny')
                })
        })
        */
        it('should handle GET querystring append original', function(done){
            agent
                .get('/querystring?search=Manny')
                .data({ range: '1..5' })
                .send(function(err, res){
                    expect(res.body.search).to.be('Manny')
                    expect(res.body.range).to.be('1..5')
                    done();
                })
        })
        /*
        it('should handle GET querystring multiple objects', function(){
            agent
                .get('/querystring')
                .data({ search: 'Manny' })
                .data({ range: '1..5' })
                .data({ order: 'desc' })
                .send(function(err, res){
                    expect(res.body.search).to.be('Manny')
                    expect(res.body.range).to.be('1..5')
                    expect(res.body.order).to.be('desc')
                })
        })
        */
        it('should handle GET querystring object .get(uri, obj)', function(done){
            agent
                .get('/querystring', { search: 'Manny' })
                .send(function(err, res){
                    expect(res.body.search).to.be('Manny')
                    done();
                })
        })

        it('should handle GET querystring object .get(uri, obj, fn)', function(done){
            agent.get('/querystring', { search: 'Manny'}, function(err, res){
                expect(res.body.search).to.be('Manny')
                done();
            })
        })

        it('should handle request(method, url)', function(done){
            agent('GET', '/foo').send(function(err, res){
                expect(res.body.foo).to.be('bar')
                done();
            })
        })

        it('should handle request(url)', function(done){
            agent.get('/foo').send(function(err, res){
                expect(res.body.foo).to.be('bar')
                done();
            })
        })

        it('should handle request(url, fn)', function(done){
            agent.get('/foo', function(err, res){
                expect(res.body.foo).to.be('bar')
                done();
            })
        })

    })
})

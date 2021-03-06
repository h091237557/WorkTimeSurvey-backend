const assert = require('chai').assert;
const request = require('supertest');
const app = require('../app');
const MongoClient = require('mongodb').MongoClient;

describe('Clairvoyance 天眼通 API', function() {
    var db = undefined;

    before('DB: Setup', function() {
        return MongoClient.connect(process.env.MONGODB_URI).then(function(_db) {
            db = _db;
        });
    });

    before('Seeding some workings', function() {
        return db.collection('workings').insertMany([
            {
                job_title: 'TEST PM',
                company: {
                    id: '00000001',
                    name: 'MY GOODJOB LIFE',
                },
                week_work_time: 40,
                created_at: new Date("2016-08-22 17:00"),
            },
            {
                job_title: 'PM',
                company: {
                    id: '00000001',
                    name: 'MY GOODJOB LIFE',
                },
                week_work_time: 20,
                created_at: new Date("2016-08-22 17:01"),
            },
            {
                job_title: 'TEST2',
                company: {
                    id: '00000001',
                    name: 'MY GOODJOB LIFE',
                },
                week_work_time: 30,
                created_at: new Date("2016-08-22 17:02"),
            },
            {
                job_title: 'TEST3',
                company: {
                    id: '00000002',
                    name: 'YOUR GOODJOB LIFE',
                },
                week_work_time: 50,
                created_at: new Date("2016-08-22 17:03"),
            },
        ]);
    });

    describe('根據公司搜尋', function() {
        it('error 422 if no company provided', function() {
            return request(app).get('/clairvoyance/search/by-company')
                .expect(422);
        });

        it('Search and return the pagination results', function() {
            return request(app).get('/clairvoyance/search/by-company')
                .query({company: 'MY GOODJOB LIFE'})
                .expect(200)
                .expect(function(res) {
                    assert.propertyVal(res.body, 'total_count', 3);
                    assert.propertyVal(res.body, 'page', 0);
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 3);
                    assert.deepProperty(res.body, 'workings.0.job_title');
                    assert.deepProperty(res.body, 'workings.0.company');
                    assert.deepProperty(res.body, 'workings.0.week_work_time');
                    assert.deepProperty(res.body, 'workings.0.created_at');
                    assert.notDeepProperty(res.body, 'workings.0.author');
                    assert.notDeepProperty(res.body, 'workings.0._id');
                });
        });

        it('小寫 company 轉換成大寫', function() {
            return request(app).get('/clairvoyance/search/by-company')
                .query({company: 'my goodjob Life'})
                .expect(200)
                .expect(function(res) {
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 3);
                });
        });

        it('company match any substring in workings.company.name', function() {
            return request(app).get('/clairvoyance/search/by-company')
                .query({company: 'GOODJOB'})
                .expect(200)
                .expect(function(res) {
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 4);
                });
        });

        it('sort workings by created_at desc', function() {
            return request(app).get('/clairvoyance/search/by-company')
                .query({company: 'MY GOODJOB LIFE'})
                .expect(200)
                .expect(function(res) {
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 3);
                    assert.deepPropertyVal(res.body, 'workings.0.week_work_time', 30);
                    assert.deepPropertyVal(res.body, 'workings.1.week_work_time', 20);
                    assert.deepPropertyVal(res.body, 'workings.2.week_work_time', 40);
                });
        });

        it('根據統編搜尋', function() {
            return request(app).get('/clairvoyance/search/by-company')
                .query({company: '00000002'})
                .expect(200)
                .expect(function(res) {
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 1);
                });
        });
    });

    describe('根據職稱搜尋', function() {
        it('error 422 if no job_title provided', function() {
            return request(app).get('/clairvoyance/search/by-job')
                .expect(422);
        });

        it('Search and return the pagination results', function() {
            return request(app).get('/clairvoyance/search/by-job')
                .query({job_title: "TEST"})
                .expect(200)
                .expect(function(res) {
                    assert.propertyVal(res.body, 'total_count', 3);
                    assert.propertyVal(res.body, 'page', 0);
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 3);
                    assert.deepProperty(res.body, 'workings.0.job_title');
                    assert.deepProperty(res.body, 'workings.0.company');
                    assert.deepProperty(res.body, 'workings.0.week_work_time');
                    assert.deepProperty(res.body, 'workings.0.created_at');
                    assert.notDeepProperty(res.body, 'workings.0.author');
                    assert.notDeepProperty(res.body, 'workings.0._id');
                });
        });

        it('小寫 job_title 轉換成大寫', function() {
            return request(app).get('/clairvoyance/search/by-job')
                .query({job_title: "test pm"})
                .expect(200)
                .expect(function(res) {
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 1);
                });
        });

        it('job_title match any substring in workings.job_title', function() {
            return request(app).get('/clairvoyance/search/by-job')
                .query({job_title: "TEST"})
                .expect(200)
                .expect(function(res) {
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 3);
                });
        });

        it('sort workings by created_at desc', function() {
            return request(app).get('/clairvoyance/search/by-job')
                .query({job_title: "TEST"})
                .expect(200)
                .expect(function(res) {
                    assert.property(res.body, 'workings');
                    assert.lengthOf(res.body.workings, 3);
                    assert.deepPropertyVal(res.body, 'workings.0.week_work_time', 50);
                    assert.deepPropertyVal(res.body, 'workings.1.week_work_time', 30);
                    assert.deepPropertyVal(res.body, 'workings.2.week_work_time', 40);
                });
        });
    });

    describe('CORS', function() {
        const allowed_origins = [
            "http://www.104.com.tw",
            "https://www.104.com.tw",
            "http://104.com.tw",
            "https://104.com.tw",
            "http://www.1111.com.tw",
            "http://www.518.com.tw",
            "http://www.yes123.com.tw",
            "https://www.yes123.com.tw",
        ];

        for (let by of ["by-job", "by-company"]) {
            const api_path = "/clairvoyance/search/" + by ;

            describe('CORS while in ' + api_path, function() {
                for (let origin of allowed_origins) {
                    it(origin + ' is in cors list', function() {
                        return request(app).get(api_path)
                            .set('origin', origin)
                            .expect(422)
                            .expect(function(res) {
                                assert.propertyVal(res.header, 'access-control-allow-origin', origin);
                            });
                    });
                }
            });

            it('reject other origin', function() {
                return request(app).get(api_path)
                    .set('origin', 'http://www.google.com.tw')
                    .expect(422)
                    .expect(function(res) {
                        assert.notProperty(res.header, 'access-control-allow-origin');
                    });
            });
        }
    });

    after(function() {
        return db.collection('workings').remove({});
    });
});

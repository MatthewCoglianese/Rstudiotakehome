let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiThings = require("chai-things");
let server = 'https://swapi.dev/api'

//Assertion style should
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings)

var planetId = '2'
var planetIdName = 'Alderaan'
var planetName ='Geonosis'

describe('Test Star Wars Planets API',() =>{
    //I started by calling the base function and validating it returned a passing status and the results has the correct number of records on the page was correct
   
   
    it('Should get all planets', (done) => {
        chai.request(server)
            .get('/planets/')
            .end((err, response) => {
             response.should.have.a.status(200);
             response.body.should.include({'count': 60});
             response.body.should.include({'next': 'https://swapi.dev/api/planets/?page=2'});
             response.body.should.have.property('results')
                                      .which.is.a('array')
                                      .length(10);
            done();
        });
    });    
    //I called page 2 since paging correctly is a comman problem on APIs and validating 
    //it returned a passing status and the results has the correct number of records on the page was correct and displayed page3 as next
    
    it('Should get all planets page 2', (done) => {
        chai.request(server)
            .get('/planets/')
            .query({page:'2'})
            .end((err, response) => {
             response.should.have.a.status(200);
             response.body.should.include({'count': 60});
             response.body.should.include({'next': 'https://swapi.dev/api/planets/?page=3'});
             response.body.should.have.property('results')
                                      .which.is.a('array')
                                      .length(10);
            done();
        });    
    });  
    //I called with an ID since this API seems to give ID based URLs for drilling in on information. 
    //It returned a passing status and the results was the correct record  
    it('Should get planets by ID', (done) => {
        chai.request(server)
            .get('/planets/' + planetId)
            .end((err, response) => {
             response.should.have.a.status(200);
             response.body.should.include({'name': planetIdName});
            done();
        });
    });   
    //I called with a bad ID to make sure it throws the correct error. 
    //It returned a status of 404  
    it('Should get planets by ID bad', (done) => {
        chai.request(server)
            .get('/planets/' + '1000')
            .end((err, response) => {
             response.should.have.a.status(404);
            done();
        });
    });   
    //I looked at the documentation and saw that the only function the system had was search by name so I wanted to test that
    //It returned a passing status and the results was returned containing a single record  
    it('Should get planets from search', (done) => {
        chai.request(server)   
            .get('/planets/')
            .query({search:planetName})
            .end((err, response) => {
             response.should.have.a.status(200);
             response.body.should.include({'count': 1});
             response.body.should.have.property('results')
                                        .which.is.a('array')
                                        .length(1)                            
            done();
        });
    });  
    //I wanted to make sure that search handled a bad search gracefully 
    //It returned a passing status and the results was returned containing 0 record  
    it('Should get planets from search', (done) => {
        chai.request(server)   
            .get('/planets/')
            .query({search:'junk'})
            .end((err, response) => {
             response.should.have.a.status(200);
             response.body.should.have.property('results')
             response.body.should.include({'count': 0});
                      
            done();
        });
    });      
});

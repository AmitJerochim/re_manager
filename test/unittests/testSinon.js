const assert = require("chai").assert;
const sinon =require("sinon");
const Functions= require("../../services/helperFunctions.js");


var functions= new Functions;
//var getAccountingPeriod= functions.getAccountingPeriod;
var sandbox = sinon.createSandbox({});

describe("getAccountingPeriod", function(){
    var tenant=
        { 
            id: 6,
            apartment_id: 7,
            name: 'detlef',
            net_cold_rent: 668,
            property_charges: 86,
            Current_tenant: 1,
            beginning_rental_period: new Date("2019-08-15T00:00:00.000Z"),
            end_rental_period: '0000-00-00' 
        }
        

    describe("getAccountingPeriod", function(){
        it("should test sinon fakes", function(){
                var fakeTenant=sinon.fake.returns(tenant);
                var fakeYear = sinon.fake.returns(2018);
            var result= functions.getAccountingPeriod(fakeTenant, fakeYear)
            assert.typeOf(result, "number");
        });
        it("should test sinon spies", function(){
                var fakeTenant=sinon.fake.returns(tenant);
                var fakeYear = sinon.fake.returns(2018);
                var spy=sinon.spy(functions, "getAccountingPeriod");
                functions.getAccountingPeriod(fakeTenant, fakeYear);
                assert.isTrue(spy.called);
        });
        
        it("should call method once with each argument", function () {
            var object = { method: function () {} };
            var spy = sinon.spy(object, "method");
        
            object.method(42);
            object.method(1);
        
            assert.isTrue(spy.withArgs(42).called);
            assert.isTrue(spy.withArgs(1).calledOnce);
            assert.isTrue(spy.withArgs(5).notCalled);
        });
        it("should test stub", function () {
            var object = { method: function () {} };
            //var spy = sinon.spy(object, "method");
            var stub =sinon.stub();
            // var fakeTenant=sinon.fake.returns(tenant);
            // var fakeYear = sinon.fake.returns(2018);
            // functions.getAccountingPeriod(fakeTenant, fakeYear);
            object.method(42);
            object.method(1);
            //stub(5);
            stub.returns(52);
            //stub.resetBehaveior();
            stub(42);
            stub(1);
            //console.log(stub());
            //assert.isTrue(stub.calledBefore(spy));
            assert.isTrue(stub.withArgs(42).called);
            assert.isTrue(stub.withArgs(1).calledOnce);
            assert.isTrue(stub.withArgs(5).notCalled);
            //sinon.assert.equal(stub(),'52');
        });
        it("should test mock", function () {
            var object = { method: function () {} };
            var mock = sandbox.mock(object);
            var expectation = sandbox.expects("method");
            expectation.withArgs(["a", "b"]).once();
            object.method(["a", "b"]);
            //mock.verify();
            

        });
    });
});
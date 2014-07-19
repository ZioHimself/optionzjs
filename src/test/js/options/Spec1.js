(function(QUnit){
  /*global window*/
  /** QUnit function aliases */
  var module      = QUnit.module,
      test        = QUnit.test,
      ok          = QUnit.ok,
      equal       = QUnit.equal,
      strictEqual = QUnit.strictEqual,
      propEqual   = QUnit.propEqual,
      throws      = QUnit.throws,

    /** test helper functions */
    _throwE     = function(){
      throw 'e'
    },
    _somethingString  = 'something',
    _somethingArray   = [_somethingString],
    _somethingBoolean = true,
    _somethingDate    = new Date(1),
    _somethingNumber  = 1,
    _somethingObject  = {something:_somethingString},
    _somethingRegex   = /something/,
    _returnSomething  = function(){ return _somethingString };

  module('test setup');
  test('_throwE should throw `"e"` when invoked', function(){
    throws(_throwE, 'e', '_throwE function should throw `"e"`, when invoked')
  });

  module('options loaded');
  test('options loaded', function() {
    ok(window.options, 'window.options should be defined');
  });

  module('options#Option');
  test('options#Option loaded', function() {
    ok(options.Option, '`window.options.Option` should be defined');
  });
  test('options#None loaded', function() {
    ok(options.None, '`window.options.None` should be defined');
  });
  test('options#Option should return options#None for undefined', function() {
    strictEqual(options.Option(), options.None, 'options#Option should return options#None for un-passed input');
    (function(undefined){
      strictEqual(options.Option(undefined), options.None, 'options#Option should return options#None for `undefined` input');
    })();
  });
  test('options#Option should return options#None for null input', function() {
    strictEqual(options.Option(null), options.None, 'options#Option should return options#None for `null` input');
  });
  test('options#Option should return options#None for NaN input', function() {
    (function(theNaN){
      ok(theNaN !== theNaN, '`NaN` should not equal itself');
      strictEqual(options.Option(theNaN), options.None, 'options#Option should return options#None for `NaN` input');
    })(NaN);
  });
  test('options#Some loaded', function() {
    ok(options.Some, '`window.options.Some` should be defined');
  });
  test('options#Option should return options#Some for defined, non-null, non-NaN, falsy input', function() {
    ok(options.Option(false) !== options.None, 'options#Option should not return options#None for false');
    ok(options.Option(0) !== options.None, 'options#Option should not return options#None for `0`');
    ok(options.Option('') !== options.None, 'options#Option should not return options#None for empty String');
    strictEqual(options.Option(false).isEmpty(), false, 'options#Option should return options#Some for false');
    strictEqual(options.Option(0).isEmpty(), false, 'options#Option should return options#Some for `0`');
    strictEqual(options.Option('').isEmpty(), false, 'options#Option should return options#Some for empty String');
  });

  module('options#None');
  test('None#isEmpty should return true', function() {
    strictEqual(options.None.isEmpty(), true, 'None#isEmpty should return true');
  });
  test('None#map should not invoke the throwing function passed', function() {
    options.None.map(_throwE);
    ok(true, 'None#map did not invoke the throwing function passed')
  });
  test('None#map should not invoke the function passed', 1, function() {
    options.None.map(function(){
      ok(false, 'None#map has invoked the function passed')
    });
    ok(true, 'None#map was invoked')
  });
  test('None#map should return options#None', function() {
    strictEqual(options.None.map(), options.None, 'None#map should return options#None when no function passed to None#map');
    ok(options.Option(_returnSomething()) !== options.None, 'options#Option should not return options#None for _returnSomething function');
    strictEqual(options.Option(_returnSomething()).isEmpty(), false, '_returnSomething function should return `something` wrapped into options#Some');
    strictEqual(options.None.map(_returnSomething), options.None, 'None#map should return options#None when something-returning function passed');
  });
  test('None#foreach should not invoke the throwing function passed', function() {
    options.None.foreach(_throwE);
    ok(true, 'None#foreach did not invoke the throwing function passed')
  });
  test('None#foreach should not invoke the function passed', 1, function() {
    options.None.foreach(function(){
      ok(false, 'None#foreach has invoked the function passed')
    });
    ok(true, 'None#foreach was invoked')
  });
  test('None#getOrElse should return `undefined` if `undefined` passed', function() {
    (function(undefined){
      strictEqual(options.None.getOrElse(), undefined, 'None#getOrElse should return `undefined` if no arguments passed');
      strictEqual(options.None.getOrElse(undefined), undefined, 'None#getOrElse should return `undefined` if `undefined` passed');
    })()
  });
  test('None#getOrElse should return `null` if `null` passed', function() {
    strictEqual(options.None.getOrElse(null), null, 'None#getOrElse should return `null` if `null` passed');
  });
  test('None#getOrElse should return `NaN` if `NaN` passed', function() {
    (function(theNaN){
      ok(theNaN !== theNaN, '`NaN` should not equal itself');
      var result = options.None.getOrElse(theNaN);
      ok(result !== result, '`None#getOrElse` should return `NaN`');
    })(NaN);
  });
  test('None#getOrElse should return the value passed', function() {
    strictEqual(options.None.getOrElse(_somethingString), _somethingString, 'None#getOrElse should return `"something"` if `"something"` passed');
    strictEqual(options.None.getOrElse(_somethingArray), _somethingArray, 'None#getOrElse should return `["something"]` if `["something"]` passed');
    strictEqual(options.None.getOrElse(_somethingBoolean), _somethingBoolean, 'None#getOrElse should return `true` if `true` passed');
    strictEqual(options.None.getOrElse(_somethingDate), _somethingDate, 'None#getOrElse should return `new Date(1)` if `new Date(1)` passed');
    strictEqual(options.None.getOrElse(_somethingNumber), _somethingNumber, 'None#getOrElse should return `1` if `1` passed');
    strictEqual(options.None.getOrElse(_somethingObject), _somethingObject, 'None#getOrElse should return `{something:"something"}` if `{something:"something"}` passed');
    strictEqual(options.None.getOrElse(_somethingRegex), _somethingRegex, 'None#getOrElse should return `/something/` if `/something/` passed');
    strictEqual(options.None.getOrElse(_returnSomething), _returnSomething, 'None#getOrElse should return `function(){ return "something" }` if `function(){ return "something" }` passed');
  });
  test('None#orNull should return `null`', function() {
    strictEqual(options.None.orNull(), null, 'None#orNull should return `null`');
  });
  test('None#toString should return `"[None]"`', function() {
    strictEqual(options.None.toString(), '[None]', 'None#toString should return `"[None]"`');
  });

  module('options#Some');
  test('Some#isEmpty should return false for non-nothing being wrapped', function() {
    strictEqual(options.Some(_somethingString).isEmpty(), false, '`Some("something").isEmpty()` should return false');
    strictEqual(options.Some(_somethingArray).isEmpty(), false, '`Some(["something"]).isEmpty()` should return false');
    strictEqual(options.Some(_somethingBoolean).isEmpty(), false, '`Some(true).isEmpty()` should return false');
    strictEqual(options.Some(_somethingDate).isEmpty(), false, '`Some(new Date(1)).isEmpty()` should return false');
    strictEqual(options.Some(_somethingNumber).isEmpty(), false, '`Some(1).isEmpty()` should return false');
    strictEqual(options.Some(_somethingObject).isEmpty(), false, '`Some({something:"something"}).isEmpty()` should return false');
    strictEqual(options.Some(_somethingRegex).isEmpty(), false, '`Some(/something/).isEmpty()` should return false');
    strictEqual(options.Some(_returnSomething).isEmpty(), false, '`Some(function(){ return "something" }).isEmpty()` should return false');
  });
  test('Some#get should return the wrapped value', function() {
    strictEqual(options.Some(_somethingString).get(), _somethingString, 'Some#get should return the wrapped `"something"`');
    strictEqual(options.Some(_somethingArray).get(), _somethingArray, 'Some#get should return the wrapped `["something"]`');
    strictEqual(options.Some(_somethingBoolean).get(), _somethingBoolean, 'Some#get should return the wrapped `true`');
    strictEqual(options.Some(_somethingDate).get(), _somethingDate, 'Some#get should return the wrapped `new Date(1)`');
    strictEqual(options.Some(_somethingNumber).get(), _somethingNumber, 'Some#get should return the wrapped `1`');
    strictEqual(options.Some(_somethingObject).get(), _somethingObject, 'Some#get should return the wrapped `{something:"something"}`');
    strictEqual(options.Some(_somethingRegex).get(), _somethingRegex, 'Some#get should return the wrapped `/something/`');
    strictEqual(options.Some(_returnSomething).get(), _returnSomething, 'Some#get should return the wrapped `function(){ return "something" }`');
  });
  test('Some#map should invoke the function passed', 2, function() {
    options.Some(_somethingString).map(function(){
      ok(true, 'Some#map invoked the function passed')
    });
    ok(true, 'Some#map was invoked')
  });
  test('Some#map should invoke the function passed with the wrapped value', 10, function() {
    options.Some(_somethingString).map(function(v){
      strictEqual(v, _somethingString, 'Some#map should invoke the function passed with `"something"` if `"something"` passed')
    });
    options.Some(_somethingArray).map(function(v){
      strictEqual(v, _somethingArray, 'Some#map should invoke the function passed with `["something"]` if `["something"]` passed');
      propEqual(v, ["something"], 'Some#map should invoke the function passed with `["something"]` if `["something"]` passed')
    });
    options.Some(_somethingBoolean).map(function(v){
      strictEqual(v, _somethingBoolean, 'Some#map should invoke the function passed with `true` if `true` passed')
    });
    options.Some(_somethingDate).map(function(v){
      strictEqual(v, _somethingDate, 'Some#map should invoke the function passed with `new Date(1)` if `new Date(1)` passed')
    });
    options.Some(_somethingNumber).map(function(v){
      strictEqual(v, _somethingNumber, 'Some#map should invoke the function passed with `1` if `1` passed')
    });
    options.Some(_somethingObject).map(function(v){
      strictEqual(v, _somethingObject, 'Some#map should invoke the function passed with `{something:"something"}` if `{something:"something"}` passed');
      propEqual(v, {something:"something"}, 'Some#map should invoke the function passed with `{something:"something"}` if `{something:"something"}` passed')
    });
    options.Some(_somethingRegex).map(function(v){
      strictEqual(v, _somethingRegex, 'Some#map should invoke the function passed with `/something/` if `/something/` passed')
    });
    options.Some(_returnSomething).map(function(v){
      strictEqual(v, _returnSomething, 'Some#map should invoke the function passed with `function(){ return "something" }` if `function(){ return "something" }` passed')
    });
  });
  test('Some#map should return options#None if undefined returned by the function passed', function() {
    strictEqual(options.Some(_somethingString).map(function(){}), options.None, 'Some#map should return options#None if nothing returned by the function passed');
    strictEqual(
      options.Some(_somethingString).map(function(){
        //noinspection UnnecessaryReturnStatementJS
        return
      }),
      options.None,
      'Some#map should return options#None if nothing returned by the function passed'
    );
    (function(undefined){
      strictEqual(
        options.Some(_somethingString).map(function(){ return undefined }),
        options.None,
        'Some#map should return options#None if `undefined` returned by the function passed'
      );
    })()
  });
  test('Some#map should return options#None if `null` returned by the function passed', function() {
    strictEqual(
      options.Some(_somethingString).map(function(){ return null }),
      options.None,
      'Some#map should return options#None if `null` returned by the function passed'
    );
  });
  test('Some#map should return options#None if `NaN` returned by the function passed', function() {
    (function(theNaN){
      ok(theNaN !== theNaN, '`NaN` should not equal itself');
      strictEqual(
        options.Some(_somethingString).map(function(){ return theNaN }),
        options.None,
        'Some#map should return options#None if `NaN` returned by the function passed'
      );
    })(NaN);
  });
  test('Some#map should wrap with options#Some if something is returned by the function passed', function() {
    ok(
      options.Some('something').map(function(){ return 1 }) !== options.None,
      '`Some("something").map(function(){ return 1 })` should not return a options#None'
    );
    strictEqual(
      options.Some('something').map(function(){ return 1 }).isEmpty(),
      false,
      '`Some("something").map(function(){ return 1 })` should return a `Some(1)`, which is not empty'
    );
    strictEqual(
      options.Some('something').map(function(){ return 1 }).get(),
      1,
      '`Some("something").map(function(){ return 1 })` should return a `Some(1)`'
    );
    ok(
      options.Some([1]).map(function(){ return 'something' }) !== options.None,
      '`Some([1]).map(function(){ return "something" })` should not return a options#None'
    );
    strictEqual(
      options.Some([1]).map(function(){ return 'something' }).isEmpty(),
      false,
      '`Some([1]).map(function(){ return "something" })` should return a `Some("something")`, which is not empty'
    );
    strictEqual(
      options.Some([1]).map(function(){ return 'something' }).get(),
      'something',
      '`Some([1]).map(function(){ return "something" })` should return a `Some("something")`'
    );
    ok(
      options.Some(true).map(function(){ return 'something' }) !== options.None,
      '`Some(true).map(function(){ return "something" })` should not return a options#None'
    );
    strictEqual(
      options.Some(true).map(function(){ return 'something' }).isEmpty(),
      false,
      '`Some(true).map(function(){ return "something" })` should return a `Some("something")`, which is not empty'
    );
    strictEqual(
      options.Some(true).map(function(){ return 'something' }).get(),
      'something',
      '`Some(true).map(function(){ return "something" })` should return a `Some("something")`'
    );
    ok(
      options.Some(new Date(1)).map(function(){ return 'something' }) !== options.None,
      '`Some(new Date(1)).map(function(){ return "something" })` should not return a options#None'
    );
    strictEqual(
      options.Some(new Date(1)).map(function(){ return 'something' }).isEmpty(),
      false,
      '`Some(new Date(1)).map(function(){ return "something" })` should return a `Some("something")`, which is not empty'
    );
    strictEqual(
      options.Some(new Date(1)).map(function(){ return 'something' }).get(),
      'something',
      '`Some(new Date(1)).map(function(){ return "something" })` should return a `Some("something")`'
    );
    ok(
      options.Some(1).map(function(){ return 'something' }) !== options.None,
      '`Some(1).map(function(){ return "something" })` should not return a options#None'
    );
    strictEqual(
      options.Some(1).map(function(){ return 'something' }).isEmpty(),
      false,
      '`Some(1).map(function(){ return "something" })` should return a `Some("something")`, which is not empty'
    );
    strictEqual(
      options.Some(1).map(function(){ return 'something' }).get(),
      'something',
      '`Some(1).map(function(){ return "something" })` should return a `Some("something")`'
    );
    ok(
      options.Some({key:'value'}).map(function(){ return 'something' }) !== options.None,
      '`Some({key:"value"}).map(function(){ return "something" })` should not return a options#None'
    );
    strictEqual(
      options.Some({key:'value'}).map(function(){ return 'something' }).isEmpty(),
      false,
      '`Some({key:"value"}).map(function(){ return "something" })` should return a `Some("something")`, which is not empty'
    );
    strictEqual(
      options.Some({key:'value'}).map(function(){ return 'something' }).get(),
      'something',
      '`Some({key:"value"}).map(function(){ return "something" })` should return a `Some("something")`'
    );
    ok(
      options.Some(/pattern/).map(function(){ return 'something' }) !== options.None,
      '`Some(/pattern/).map(function(){ return "something" })` should not return a options#None'
    );
    strictEqual(
      options.Some(/pattern/).map(function(){ return 'something' }).isEmpty(),
      false,
      '`Some(/pattern/).map(function(){ return "something" })` should return a `Some("something")`, which is not empty'
    );
    strictEqual(
      options.Some(/pattern/).map(function(){ return 'something' }).get(),
      'something',
      '`Some(/pattern/).map(function(){ return "something" })` should return a `Some("something")`'
    );
    ok(
      options.Some(function(){ return 1 }).map(function(){ return 'something' }) !== options.None,
      '`Some(function(){ return 1 }).map(function(){ return "something" })` should not return a options#None'
    );
    strictEqual(
      options.Some(function(){ return 1 }).map(function(){ return 'something' }).isEmpty(),
      false,
      '`Some(function(){ return 1 }).map(function(){ return "something" })` should return a `Some("something")`, which is not empty'
    );
    strictEqual(
      options.Some(function(){ return 1 }).map(function(){ return 'something' }).get(),
      'something',
      '`Some(function(){ return 1 }).map(function(){ return "something" })` should return a `Some("something")`'
    );
  });
  test('Some#foreach should invoke the function passed', 2, function() {
    options.Some("something").foreach(function(){
      ok(true, 'Some#foreach has invoked the function passed')
    });
    ok(true, 'Some#foreach was invoked');
  });
  test('Some#foreach should not catch exceptions', function() {
    throws(
      function(){ options.Some("something").foreach(function(){ throw 'e' }) }, 'e',
      '`Some#foreach(function(){ throw "e" })` should throw `"e"`'
    )
  });
  test('Some#foreach should pass the wrapped value to the function passed', function() {
    options.Some("something").foreach(function(v){
      strictEqual(v, "something", '`Some("something").foreach(function(v){ ... })` should invoke the function passed with `"something"`')
    });
    options.Some(_somethingArray).foreach(function(v){
      strictEqual(v, _somethingArray, '`Some(["something"]).foreach(function(v){ ... })` should invoke the function passed with `["something"]`');
      propEqual(v, ["something"], '`Some(["something"]).foreach(function(v){ ... })` should invoke the function passed with `["something"]`')
    });
    options.Some(true).foreach(function(v){
      strictEqual(v, true, '`Some(true).foreach(function(v){ ... })` should invoke the function passed with `true`')
    });
    options.Some(_somethingDate).foreach(function(v){
      strictEqual(v, _somethingDate, '`Some(new Date(1)).foreach(function(v){ ... })` should invoke the function passed with `new Date(1)`')
    });
    options.Some(1).foreach(function(v){
      strictEqual(v, 1, '`Some(1).foreach(function(v){ ... })` should invoke the function passed with `1`')
    });
    options.Some(_somethingObject).foreach(function(v){
      strictEqual(v, _somethingObject, '`Some({something:"something"}).foreach(function(v){ ... })` should invoke the function passed with `{something:"something"}`');
      propEqual(v, {something:"something"}, '`Some({something:"something"}).foreach(function(v){ ... })` should invoke the function passed with `{something:"something"}`')
    });
    options.Some(_somethingRegex).foreach(function(v){
      strictEqual(v, _somethingRegex, '`Some(/something/).foreach(function(v){ ... })` should invoke the function passed with `/something/`')
    });
    options.Some(_returnSomething).foreach(function(v){
      strictEqual(v, _returnSomething, '`Some(function(){ return "something" }).foreach(function(v){ ... })` should invoke the function passed with `function(){ return "something" }`')
    });
  });
  test('Some#foreach should return itself', function() {
    var somethingOption = options.Some("something");
    strictEqual(
      somethingOption.foreach(function(){
        return "something"
      }),
      somethingOption,
      '`options.Some("something").foreach(function(){ return "something" })` should return itself'
    );
    strictEqual(
      somethingOption.foreach(function(){}),
      somethingOption,
      '`options.Some("something").foreach(function(){})` should return itself'
    );
    strictEqual(
      somethingOption.foreach(function(){
        //noinspection UnnecessaryReturnStatementJS
        return
      }),
      somethingOption,
      '`options.Some("something").foreach(function(){ return })` should return itself'
    );
    (function(undefined){
      strictEqual(
        somethingOption.foreach(function(){
          return undefined
        }),
        somethingOption,
        '`options.Some("something").foreach(function(){ return undefined })` should return itself'
      );
    })();
    strictEqual(
      somethingOption.foreach(function(){
        return null
      }),
      somethingOption,
      '`options.Some("something").foreach(function(){ return null })` should return itself'
    );
    (function(theNaN){
      ok(theNaN !== theNaN, '`NaN` should not equal itself');
      strictEqual(
        somethingOption.foreach(function(){
          return theNaN
        }),
        somethingOption,
        '`options.Some("something").foreach(function(){ return NaN })` should return itself'
      )
    })(NaN);
  });
  test('Some#getOrElse returns the wrapped value', function() {
    strictEqual(
      options.Some("something").getOrElse(),
      "something",
      '`options.Some("something").getOrElse()` should return the wrapped value'
    );
    (function(undefined){
      strictEqual(
        options.Some("something").getOrElse(undefined),
        "something",
        '`options.Some("something").getOrElse(undefined)` should return the wrapped value'
      )
    })();
    strictEqual(
      options.Some("something").getOrElse(null),
      "something",
      '`options.Some("something").getOrElse(null)` should return the wrapped value'
    );
    (function(theNaN){
      ok(theNaN !== theNaN, '`NaN` should not equal itself');
      strictEqual(
        options.Some("something").getOrElse(theNaN),
        "something",
        '`options.Some("something").getOrElse(NaN)` should return the wrapped value'
      )
    })(NaN);
    strictEqual(
      options.Some("something").getOrElse("another_something"),
      "something",
      '`options.Some("something").getOrElse("another_something")` should return the wrapped value'
    );
  });
  test('Some#orNull returns the wrapped value', function() {
    strictEqual(
      options.Some("something").orNull(),
      "something",
      '`options.Some("something").orNull()` should return the wrapped value'
    );
    strictEqual(
      options.Some(_somethingArray).orNull(),
      _somethingArray,
      '`options.Some(["something"]).orNull()` should return the wrapped value'
    );
    strictEqual(
      options.Some(true).orNull(),
      true,
      '`options.Some(true).orNull()` should return the wrapped value'
    );
    strictEqual(
      options.Some(_somethingDate).orNull(),
      _somethingDate,
      '`options.Some(new Date(1)).orNull()` should return the wrapped value'
    );
    strictEqual(
      options.Some(1).orNull(),
      1,
      '`options.Some(1).orNull()` should return the wrapped value'
    );
    strictEqual(
      options.Some(_somethingObject).orNull(),
      _somethingObject,
      '`options.Some({something:"something"}).orNull()` should return the wrapped value'
    );
    strictEqual(
      options.Some(_somethingRegex).orNull(),
      _somethingRegex,
      '`options.Some(/something/).orNull()` should return the wrapped value'
    );
    strictEqual(
      options.Some(_returnSomething).orNull(),
      _returnSomething,
      '`options.Some(function(){ return "something" }).orNull()` should return the wrapped value'
    );
  });
  test('`Some(v).toString()` should return `[Some ${v}]`', function() {
    strictEqual(
      options.Some("something").toString(), '[Some something]',
      '`Some("something").toString()` should return `[Some something]`'
    )
  });

  module('options#objectPropertyOption');
  test('options#objectPropertyOption loaded', function() {
    ok(options.objectPropertyOption, '`options.objectPropertyOption` should be defined');
  });
  test('options#objectPropertyOption should return options#None for bad input', function() {
    //noinspection JSCheckFunctionSignatures
    strictEqual(
      options.objectPropertyOption(), options.None,
      'options#objectPropertyOption should return options#None if no arguments passed'
    );
    (function(undefined){
      //noinspection JSCheckFunctionSignatures
      strictEqual(
        options.objectPropertyOption(undefined), options.None,
        'options#objectPropertyOption should return options#None if propKey argument not passed'
      )
    })();
    //noinspection JSCheckFunctionSignatures
    strictEqual(
      options.objectPropertyOption(null), options.None,
      'options#objectPropertyOption should return options#None if propKey argument not passed'
    );
    (function(theNaN){
      ok(theNaN !== theNaN, '`NaN` should not equal itself');
      //noinspection JSCheckFunctionSignatures
      strictEqual(
        options.objectPropertyOption(theNaN), options.None,
        'options#objectPropertyOption should return options#None if propKey argument not passed'
      )
    })(NaN);
    //noinspection JSCheckFunctionSignatures
    strictEqual(
      options.objectPropertyOption({something:"something"}), options.None,
      'options#objectPropertyOption should return options#None if no propKey argument not passed'
    );
  });
  test('options#objectPropertyOption should return options#None when key not found', function() {
    strictEqual(
      options.objectPropertyOption({key1:"value"}, 'key100500'), options.None,
      '`options.objectPropertyOption({key1:"value"}, "key100500")` should return options#None due to `"key100500"` not found'
    );
    strictEqual(
      options.objectPropertyOption(["something"], 1), options.None,
      '`options.objectPropertyOption(["something"], 1)` should return options#None due to only one element in the array'
    );
  });
  test('options#objectPropertyOption should return options#Some when property found', function() {
    ok(
      options.objectPropertyOption({key:"value"}, "key") !== options.None,
      '`options.objectPropertyOption({key:"value"}, "key")` should not return options#None'
    );
    strictEqual(
      options.objectPropertyOption({key:"value"}, "key").isEmpty(),
      false,
      '`options.objectPropertyOption({key:"value"}, "key")` should return not empty options#Option'
    );
    strictEqual(
      options.objectPropertyOption({key:"value"}, "key").get(),
      "value",
      '`options.objectPropertyOption({key:"value"}, "key")` should return`Some("value")`'
    );
    ok(
      options.objectPropertyOption(["something"], 0) !== options.None,
      '`options.objectPropertyOption(["something"], 0)` should not return options#None'
    );
    strictEqual(
      options.objectPropertyOption(["something"], 0).isEmpty(),
      false,
      '`options.objectPropertyOption(["something"], 0)` should return not empty options#Option'
    );
    strictEqual(
      options.objectPropertyOption(["something"], 0).get(),
      "something",
      '`options.objectPropertyOption(["something"], 0)` should return`Some("something")`'
    );
  });

  module('options#helperFns');
  test('options#helperFns loaded', function() {
    ok(options.helperFns, '`options.helperFns` should be defined');
  });
  test('helperFns#notEmptyArrayOrNothing loaded', function() {
    ok(options.helperFns.notEmptyArrayOrNothing, '`options.helperFns.notEmptyArrayOrNothing` should be defined');
  });
  test('helperFns#notEmptyArrayOrNothing should return nothing, if non-array passed', function() {
    (function(){
      //noinspection JSCheckFunctionSignatures
      var result = options.helperFns.notEmptyArrayOrNothing();
      equal(
        !!result, false,
        'helperFns#notEmptyArrayOrNothing should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        'result, wrapped with option should be options#None'
      );
    })();
    (function(undefined){
      var result = options.helperFns.notEmptyArrayOrNothing(undefined);
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing(undefined)` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing(undefined)` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing(null);
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing(null)` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing(null)` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing({key:"value"});
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing({key:"value"})` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing({key:"value"})` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing("something");
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing("something")` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing("something")` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing(true);
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing(true)` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing(true)` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing(new Date(1));
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing(new Date(1))` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing(new Date(1))` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing(1);
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing(1)` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing(1)` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing(/something/);
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing(/something/)` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing(/something/)` should return result, which, when wrapped with option, should be options#None'
      );
    })();
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing(function(){ return "something" });
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing(function(){ return "something" })` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing(function(){ return "something" })` should return result, which, when wrapped with option, should be options#None'
      );
    })();
  });
  test('helperFns#notEmptyArrayOrNothing should return nothing, if the array passed is empty', function(){
    (function(){
      var result = options.helperFns.notEmptyArrayOrNothing([]);
      equal(
        !!result, false,
        '`options.helperFns.notEmptyArrayOrNothing([])` should return a falsy value'
      );
      strictEqual(
        options.Option(result), options.None,
        '`options.helperFns.notEmptyArrayOrNothing([])` should return result, which, when wrapped with option, should be options#None'
      );
    })();
  });
  test('helperFns#notEmptyArrayOrNothing should return the array, if it is not empty', function(){
    strictEqual(
      options.helperFns.notEmptyArrayOrNothing(_somethingArray),
      _somethingArray,
      '`options.helperFns.notEmptyArrayOrNothing(["something"])` should return`["something"]`'
    );
  });
})(QUnit);
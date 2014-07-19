/**!
 * @fileOverview options.js - another option (maybe) monad implementation
 * @author <a href="mailto:ziohimself@gmail.com">Serhiy "seruji" Onyshchenko</a>
 * @version 0.1
 * @requires <a href="http://underscorejs.org/">underscorejs</a>
 * Licensed under
 *   <a href="http://www.opensource.org/licenses/mit-license">MIT License</a>
 * */
(function (root, factory) {
  /** @see <a href="https://github.com/umdjs/umd/blob/master/returnExports.js">exports doc</a> */
  //noinspection JSUnresolvedVariable
  if (typeof exports === 'object') {
    // Node
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    module.exports = factory(require('underscore'));
  } else { //noinspection JSUnresolvedVariable
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        //noinspection JSUnresolvedFunction
      define(['underscore'], factory);
      } else {
        // Browser globals (root is window)
        root.options = factory(root._);
      }
  }
})(this, function (_) {
  var options = {},
      _isEmpty = function(v) {
        return (_.isUndefined(v) ||
                _.isNull(v) ||
                _.isNaN(v)
        )
      };
  options.Option = function(v){
    return _isEmpty(v)? options.None : options.Some(v)
  };
  options.None = (function(){
    var _returnThis = function() {
          return this
        },
        _returnTrue = _.constant(true),
        _toString = _.constant('[None]'),
        _returnNull = _.constant(null);
    return {
      /** @function */
      map: _returnThis,
      /** @function */
      isEmpty: _returnTrue,
      /** @function */
      foreach: _returnThis,
      /** @function */
      getOrElse: _.identity,
      /** @function */
      orNull: _returnNull,
      /** @function */
      toString: _toString
    }
  })();
  options.Some = function(v){
    var _returnV      = _.constant(v),
        _returnFalse  = _.constant(false),
        _map          = function(fn) {
          return options.Option(fn.call(this, v))
        },
        _foreach      = function(fn) {
          fn.call(this, v);
          return this
        },
        _toString     = _.constant('[Some '+ v +']');
    return {
      /** @function */
      map: _map,
      /** @function */
      get: _returnV,
      /** @function */
      isEmpty: _returnFalse,
      /** @function */
      foreach: _foreach,
      /** @function */
      getOrElse: _returnV,
      /** @function */
      orNull:  _returnV,
      /** @function */
      toString: _toString
    }
  };
  /**
   * @function
   * @param obj - {@link Object}, property of which will be taken
   * @param propKey - {@link String}, name of the property to be taken from the obj
   * @return Object Option of objects property
   * */
  options.objectPropertyOption = function(obj, propKey){
    return options.Option(obj).map(function(obj){ return obj[propKey] })
  };
  /** Object, containing helper functions, which may be used in {@link Option#map} and etc. */
  options.helperFns = {};
  /**
   * @function
   * @param arr - {@link Array}, property of which will be taken
   * @return Array or nothing, if the array is empty
   * */
  options.helperFns.notEmptyArrayOrNothing = function(arr){
    if (!_.isArray(arr) || arr.length < 1) {
      //noinspection JSValidateTypes
      return
    }
    return arr
  };
  return options
});
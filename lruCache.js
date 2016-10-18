/*

Author: Mohit Chawla | www.mohitchawla.in | mohitchawla@cse.ism.ac.in
This script lets you make an easy cache for applications like 
"Recent searches", "History based auto complete" etc.
*/

'use strict';

/**
 * Create a cache with maxsize
 *
 * @param {string} maxsize
 * 
 */
var LRUCache = function (maxsize) {
  this._keys = [];
  this._items = [];
  this._expires = [];
  this._size = 0;
  this._maxsize = maxsize || 1024;
  if (this._maxsize < 2) {
    throw new Error("Maximum size must be greater than 2");
  }
};

LRUCache.prototype = {
  /**
   * Create a cache with maxsize
   *
   * @param {string} key
   * @param {string} value
   * @return {string} inputIndex
   * 
   */
  set: function (key, value) {
    var keys = this._keys,
        items = this._items,
        expires = this._expires,
        size = this._size,
        maxsize = this._maxsize;

    var inputIndex = size;
    if (size >= maxsize) { // size Limit reached, need tp delete
      //find the oldest entry for the "key" and delete
      var oldestKey = Date.now();
      var oldestIndex = -1;
      for(var i=0;i<expires[key].length;i++){
        if(expires[key][i] < oldestKey){
          oldestKey = expires[key][i],oldestIndex = i;
        }
      }

      size--;
      console.log("deleting: "+expires[key][size])
      delete expires[key][oldestIndex];
      delete items[key][oldestIndex];

      keys[key][oldestIndex] = key;
      items[key][oldestIndex] = value;
      expires[key][oldestIndex] = Date.now();
      inputIndex = oldestIndex;
    }
    else{
      console.log("in else//");
      if(!items[key]){
        items[key] = new Array();
      }
      if(!keys[key]){
        keys[key] = new Array();
      }
      if(!expires[key]){
        expires[key] = new Array();
      }

      keys[key][size] = key;
      items[key][size] = value;
      expires[key][size] = Date.now();

    }

    size++;

    this._keys = keys;
    this._items = items;
    this._expires = expires;
    this._size = size;

    return inputIndex;
  },
  /**
   * get all items for a key 
   *
   * @param {string} key
   * @param {functino} callback
   * @return {array} inputIndex
   * 
   */
  get: function (key, callback) {
    if(key){
      //TODO: consider updating timestamp of this , to make it more recently accessed
      var items = this._items[key];
      return items; 
    }
    else{
      return "Error: missing argument,key needed!"
    }
  },
  /**
   * get all keys 
   *
   * @return {array} allKeys
   * 
   */
  keys : function(){
    var allKeys = [];
    for(key in this._keys){
      allKeys.push(key);
    }
    return allKeys;
  },
};
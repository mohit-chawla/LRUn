/*

This script lets you make an easy cache for applications like 
"Recent searches", "History based auto complete" etc.
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
  set: function (key, value, callback) {
    var keys = this._keys,
        items = this._items,
        expires = this._expires,
        size = this._size,
        maxsize = this._maxsize;

    if (size >= maxsize) { // size Limit reached, need tp delete
      //find the oldest entry for the "key" and delete
      console.log("in if");
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

    if (callback) return callback(size);
  },

  get: function (key, callback) {
    var item = this._items[key];
    if (item) this._expires[key] = Date.now();
    if (callback) return callback(item);
    return item;
  },
  allkeys : function(){
    var allKeys = [];
    for(key in this._keys){
      allKeys.push(key);
    }
    return allKeys;
  },


};
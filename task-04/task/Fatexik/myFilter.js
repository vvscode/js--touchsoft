/**
 * Написать реализацию метода .myFilter, который работает
 * аналогично оригинальному
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */

Array.prototype.myFilter = function (functFilter,context) {
    var filter;
    var filterArray;
    var thisArray = this;
    var i;
    if (functFilter == null) {
        throw "filter functiond not define";
    }
    functFilter = functFilter.bind(context);
    filterArray = [];
    for (i = 0; i < this.length; i++) {
       thisArray[i]!=null && filter(this[i],i,this) ? filterArray.push(this[i]) : "";
    }
    return filterArray;
}
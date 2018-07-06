/**
 * Написать фукнцию обратную promisify
 *
 * она принимает фукнцию, которая возвращает результат в виде promise
 * и возвращает обертку работающую на error-first коллбэке
 */

function unpromisify (promisify) {
    var promise = promisify;
    return function getUnpromisify () {
        var args = [].slice.call(arguments);
        var callback = args[args.length - 1];

        if(typeof callback === "function") {
            args.pop();
            promise.apply(this, args).then( function setApply(data){
                callback(null, data)
            }, function setData (data) {
                callback(data);
            });
            return;
        }
        promise();
    }
}
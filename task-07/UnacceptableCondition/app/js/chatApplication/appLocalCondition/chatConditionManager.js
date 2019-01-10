/* global localStorageManager */
/* global configObj */
/* exported getAPI */
//= ../../common/localStorage/localStorageManager.js

function saveCurrentConditionToLocalStorage() {
    localStorageManager.write(
        {
            userId: configObj.currentUserSettings.userId,
            isMinimize: configObj.currentUserSettings.isMinimize,
            userName: configObj.currentUserSettings.userName
        },
        configObj.LOCAL_STORAGE_NAME
    );
}

function getCurrentConditionFromLocalStorage(callback) {
    var condition = localStorageManager.get(configObj.LOCAL_STORAGE_NAME);
    if (condition) {
        configObj.currentUserSettings.userId = condition.userId;
        configObj.currentUserSettings.userName = condition.userName;
        configObj.currentUserSettings.isMinimize = condition.isMinimize;
    }
    if (callback instanceof Function) {
        callback(condition);
    }
    return condition;
}

function getAPI() {
    return {
        saveCondition: saveCurrentConditionToLocalStorage,
        setupCondition: getCurrentConditionFromLocalStorage
    };
}

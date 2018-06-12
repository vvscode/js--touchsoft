// Модуль предоставляет способ отправки запроса к источнику данных
// Для реквеста необходим путь, тело запроса, тип запроса
// request возвращает Promise
var dataSource = (function getDataSourceAPI(dataSourceConfigurationObject) {
    var dataBaseConnector;
    var dataBaseAPI;

    function DataBaseConnector() {}

    DataBaseConnector.prototype.requestFetch = function requestFetch(
        requestPath,
        requestBody,
        requestType
    ) {
        return fetch(requestPath, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: requestType,
            body: requestBody
        }).then(function getResponseJSON(response) {
            return response.json();
        });
    };

    DataBaseConnector.prototype.requestXMR = function requestXMR(
        requestPath,
        requestBody,
        requestType
    ) {
        return new Promise(function request(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(requestType, requestPath, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function loadCase() {
                resolve(JSON.parse(xhr.response));
            };
            xhr.onerror = function errorCase() {
                reject(xhr.statusText);
            };
            if (requestBody) {
                xhr.send(requestBody);
            } else {
                xhr.send();
            }
        });
    };

    dataBaseConnector = new DataBaseConnector();
    if (dataSourceConfigurationObject.typeOfRequest === "fetch") {
        dataBaseAPI = {
            request: dataBaseConnector.requestFetch
        };
    } else {
        dataBaseAPI = {
            request: dataBaseConnector.requestXMR
        };
    }

    return dataBaseAPI;
})(dataSourceConfig);

// Модуль для получения данных
// Все API функции возвращают промисы
dashboardDataSource = (function(dataSourceObject, dataBaseUrl) {
    var dashboardDataSourceInstance;
    var dashboardDataSourceAPI;

    function DashboardDataSource(dataSourceObject, dataBaseUrl) {
        this.dataSource = dataSourceObject;
        this.dbURL = dataBaseUrl;
    }

    DashboardDataSource.prototype.createRequestPath = function createRequestPath(
        dataBaseURL,
        userId,
        requestPostfix
    ) {
        var path = dataBaseURL + "/users";
        if (userId !== null) {
            path += "/" + userId;
        }
        if (requestPostfix !== null) {
            path += "/" + requestPostfix;
        }
        path += ".json";
        return path;
    };

    // Работа с КОНКРЕТНЫМ юзером

    // Получить все сообщения и настройки пользователя
    DashboardDataSource.prototype.getUserData = function getUserData(userId) {
        var userData = {};
        var requestPath = this.createRequestPath(this.dbURL, userId, null);
        return this.dataSource
            .request(requestPath, null, "GET", "application/json")
            .then(function setUserData(data) {
                if (data) {
                    Object.keys(data).map(function(key) {
                        userData[key] = data[key];
                    });
                }
            })
            .then(function returnUsersList() {
                return userData;
            });
    };

    // Сохраняет количество непрочитанных юзером сообщений
    DashboardDataSource.prototype.setAmountOfNoReadMessage = function getAmountOfNoReadMessage(
        userId,
        count
    ) {
        var requestPath = this.createRequestPath(
            this.dbURL,
            userId,
            "noReadMessage"
        );
        var jsonMessage = JSON.stringify({
            count: count
        });
        return this.dataSource.request(
            requestPath,
            jsonMessage,
            "PUT",
            "application/json"
        );
    };

    // Получает опр поле настроек пользователя
    DashboardDataSource.prototype.getSettingField = function getAmountOfNoReadMessage(
        userId,
        fieldName
    ) {
        var requestPath = this.createRequestPath(this.dbURL, userId, fieldName);
        return this.dataSource.request(
            requestPath,
            null,
            "GET",
            "application/json"
        );
    };

    // Устанавливает опр поле настроек пользователя
    DashboardDataSource.prototype.setSettingField = function getAmountOfNoReadMessage(
        userId,
        fieldName,
        value
    ) {
        var requestPath = this.createRequestPath(this.dbURL, userId, fieldName);
        return this.dataSource.request(
            requestPath,
            JSON.stringify(value),
            "PUT",
            "application/json"
        );
    };

    // Отправить сообщение пользователю
    DashboardDataSource.prototype.sendMessageToUser = function sendMessageToUser(
        userId,
        messageObject
    ) {
        var requestPath = this.createRequestPath(this.dbURL, userId, "messages");
        var jsonMessage = JSON.stringify([
            {
                date: messageObject.date,
                message: messageObject.message,
                title: "message",
                user: messageObject.sender
            }
        ]);
        return this.dataSource.request(
            requestPath,
            jsonMessage,
            "POST",
            "application/json"
        );
    };

    // изменить настройки пользователя
    DashboardDataSource.prototype.setUserSettings = function setUserSettings(
        userId,
        settingsObject
    ) {
        var requestPath = this.createRequestPath(this.dbURL, userId, "settings");
        var jsonSettings = JSON.stringify([
            {
                userSettings: {
                    isMinimize: settingsObject.isMinimize,
                    lastOnline: settingsObject.lastOnline,
                    readLastMessage: settingsObject.readLastMessage,
                    sendNewMessage: settingsObject.sendNewMessage,
                    userName: settingsObject.userName
                }
            }
        ]);
        return this.dataSource.request(
            requestPath,
            jsonSettings,
            "PUT",
            "application/json"
        );
    };

    // Работа со ВСЕМИ юзерами

    // получить все данные, всех пользователей
    DashboardDataSource.prototype.getAllUsers = function getAllUsers() {
        var usersDataList = {};
        var requestPath = this.createRequestPath(this.dbURL, null, null);
        return this.dataSource
            .request(requestPath, null, "GET", "application/json")
            .then(function setUsersList(data) {
                if (data) {
                    Object.keys(data).map(function(key) {
                        usersDataList[key] = data[key];
                    });
                }
            })
            .then(function returnUsersList() {
                return usersDataList;
            });
    };

    // Создаем instance объекта, задаем API

    dashboardDataSourceInstance = new DashboardDataSource(
        dataSourceObject,
        dataBaseUrl
    );
    dashboardDataSourceAPI = {
        oneUserAPI: {
            getUserData: dashboardDataSourceInstance.getUserData.bind(
                dashboardDataSourceInstance
            ),
            sendMessageToUser: dashboardDataSourceInstance.sendMessageToUser.bind(
                dashboardDataSourceInstance
            ),
            setUserSettings: dashboardDataSourceInstance.setUserSettings.bind(
                dashboardDataSourceInstance
            ),
            setAmountOfNoReadMessage: dashboardDataSourceInstance.setAmountOfNoReadMessage.bind(
                dashboardDataSourceInstance
            ),
            setField: dashboardDataSourceInstance.setSettingField.bind(
                dashboardDataSourceInstance
            ),
            getField: dashboardDataSourceInstance.getSettingField.bind(
                dashboardDataSourceInstance
            )
        },
        allUsersAPI: {
            getAllUsers: dashboardDataSourceInstance.getAllUsers.bind(
                dashboardDataSourceInstance
            )
        }
    };

    return dashboardDataSourceAPI;
})(dataSource, dataBaseUrl);

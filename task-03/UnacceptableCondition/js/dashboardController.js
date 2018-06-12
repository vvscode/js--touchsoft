var dashboardController = (function(
    userListManagerObject,
    chatManagerObject,
    dashboardDataSourceObject,
    configObject
) {
    var dashboardControllerInstance;
    // id юзера с которым открыт чат
    var currentUserId = null;
    // параметр фильтрации юзеров
    var filterBy = null;
    // параметр сортировки юзеров
    var sortBy = null;

    function DashboardController(
        userListManagerObj,
        chatManagerObj,
        dashboardDataSourceObj,
        configObj
    ) {
        this.config = configObj;
        this.chatModule = chatManagerObj;
        this.usersModule = userListManagerObj;
        this.dataSourceModule = dashboardDataSourceObj;
        this.DOMVariables = {
            users: [],
            chat: getElement(
                this.config.CSS_CHAT_CONTAINS_BLOCK_STYLE
            ),
            sendMessageButton: getElement(
                this.config.CSS_SEND_MESSAGE_BUTTON_CLASS
            ),
            messageInput: getElement(
                this.config.CSS_INPUT_MESSAGE_BLOCK_ID
            ),
            closeButton: getElement(
                this.config.CSS_CLOSE_CHAT_BUTTON_CLASS
            ),
            filterInput: getElement(this.config.CSS_FILTER_INPUT_ID),
            sortSelect: getElement(this.config.CSS_SORT_SELECT_ID)
        };
    }

    DashboardController.prototype.startApp = function startApp() {
        this.setupUsersListBlock(null);
        this.setupCommonListenerFunctions();
        this.setupIntervalFunctions();
    };

    DashboardController.prototype.setupCommonListenerFunctions = function() {
        this.DOMVariables.sendMessageButton.addEventListener(
            "click",
            this.sendMessageToUser.bind(this)
        );
        this.DOMVariables.closeButton.addEventListener(
            "click",
            this.closeConversation.bind(this)
        );
        this.DOMVariables.filterInput.addEventListener(
            "input",
            this.filter.bind(this)
        );
        this.DOMVariables.sortSelect.addEventListener(
            "input",
            this.sort.bind(this)
        );
    };

    DashboardController.prototype.saveCurrentConditionToLocalStorage = function() {
        var serialCondition = JSON.stringify({
            filter: filterBy,
            sort: sortBy,
            currentUserId: currentUserId
        });
        localStorage.setItem("currentCondition", serialCondition);
    };

    DashboardController.prototype.getCurrentUserIdFromLocalStorage = function() {
        var serialCondition = localStorage.getItem("currentCondition");
        var condition = null;
        if (serialCondition) {
            condition = JSON.parse(serialCondition);
            filterBy = condition.filter;
            sortBy = condition.sort;
            currentUserId = condition.currentUserId;
        }
        return condition;
    };

    DashboardController.prototype.localSettingsSetup = function(condition) {
        if (condition) {
            if (condition.filter) {
                this.DOMVariables.filterInput.value = condition.filter;
                this.filter();
            }
            if (condition.sort) {
                this.DOMVariables.sortSelect.value = condition.sort;
                this.sort();
            }
            if (condition.currentUserId) {
                currentUserId = condition.currentUserId;
                this.startConversationWithUser(currentUserId);
            }
        }
    };

    ///////// WORK WITH USERS_MODULE /////////

    DashboardController.prototype.getUsersListFromDataSource = function() {
        var usersList = [];
        var controllerRef = this;
        return this.dataSourceModule.allUsersAPI
            .getAllUsers()
            .then(function(userData) {
                Object.keys(userData).map(function(userId) {
                    controllerRef.addUserToUsersArray(
                        userData[userId],
                        userId,
                        usersList
                    );
                });
            })
            .then(function() {
                return usersList;
            });
    };

    // фильтрация списка юзеров
    DashboardController.prototype.filter = function filter() {
        filterBy = this.DOMVariables.filterInput.value;
        this.saveCurrentConditionToLocalStorage();
        this.usersModule.filterByName(filterBy);
        this.usersModule.displayUsers();
    };

    // сортировка списка юзеров
    DashboardController.prototype.sort = function sort() {
        sortBy = this.DOMVariables.sortSelect.value;
        this.saveCurrentConditionToLocalStorage();
        this.usersModule.sortUsersByField(sortBy);
        this.usersModule.displayUsers();
    };

    DashboardController.prototype.addUserToUsersArray = function addUserToUsersList(
        user,
        userId,
        usersList
    ) {
        var userIsOnline = this.usersModule.userIsOnline(user.lastOnline);
        usersList.push({
            userId: userId,
            userElement: this.usersModule.createUserElement(userId, userIsOnline),
            online: userIsOnline,
            visible: true,
            sendNewMessage: user.sendNewMessage,
            readLastMessage: user.readLastMessage,
            lastOnline: user.lastOnline,
            userName: user.settings[0].userSettings.userName
        });
    };

    // Помечает канал юзера как прочитанный (если там есть непрочитанные сообщения)
    DashboardController.prototype.markMessageFromUserAsRead = function(userId) {
        var userIndex = this.usersModule.getUserFromUserListById(userId);
        this.usersModule.uList[userIndex].sendNewMessage = false;
        this.dataSourceModule.oneUserAPI.setField(
            userId,
            "sendNewMessage",
            this.usersModule.uList[userIndex].sendNewMessage
        );
    };

    // Инициализация usersModule - цепочка промисов обновляющая usersList и его представление на экране
    DashboardController.prototype.setupUsersListBlock = function(newUserList) {
        this.setupUsersListeners(newUserList);
    };

    // Добавляет юзер лист в юзер лист модуль. Важно: если передан как параметр новый юзер лист
    // (нужно для обновления), то добавляется он, иначе данные берутся с сервера
    // объект Promise создается для совместимости
    DashboardController.prototype.setUsersListToUsersModule = function(
        newUserList
    ) {
        var controllerRef = this;
        if (!newUserList) {
            return this.getUsersListFromDataSource()
                .then(function(usersListObject) {
                    controllerRef.usersModule.setUserList(usersListObject);
                })
                .then(function localSettingsSetup() {
                    var condition = controllerRef.getCurrentUserIdFromLocalStorage();
                    controllerRef.localSettingsSetup(condition);
                });
        }
        return new Promise(function(resolve) {
            resolve(controllerRef.usersModule.setUserList(newUserList));
        });
    };

    DashboardController.prototype.displayUsersList = function(newUserList) {
        var controllerRef = this;
        return this.setUsersListToUsersModule(newUserList).then(function() {
            controllerRef.usersModule.displayUsers();
        });
    };

    DashboardController.prototype.getAcessToUsersList = function accessToUsersDOM(
        newUserList
    ) {
        var controllerRef = this;
        return this.displayUsersList(newUserList).then(function() {
            controllerRef.DOMVariables.users = getElement(
                controllerRef.usersModule.config.USER_ELEMENT_CSS_CLASS, true
            );
        });
    };

    // Переключает стили в списке юзеров у юзера, если от него есть новые не прочитанные мессаджи
    DashboardController.prototype.blinkNewMessageFromUsers = function() {
        var controllerRef = this;
        Object.keys(controllerRef.usersModule.uList).map(function(key) {
            if (!controllerRef.usersModule.uList[key].sendNewMessage) {
                controllerRef.usersModule.uList[key].userElement.classList.remove(
                    controllerRef.config.CSS_HAVE_NEW_MESSAGE_STYLE
                );
            } else {
                controllerRef.usersModule.uList[key].userElement.classList.toggle(
                    controllerRef.config.CSS_HAVE_NEW_MESSAGE_STYLE
                );
            }
        });
    };

    DashboardController.prototype.setupUsersListeners = function setupUsersListeners(
        newUserList
    ) {
        var controllerRef = this;
        return this.getAcessToUsersList(newUserList).then(function() {
            Array.from(controllerRef.DOMVariables.users).forEach(function(element) {
                element.addEventListener(
                    "click",
                    controllerRef.userListener.bind(
                        controllerRef,
                        element.firstChild.innerText
                    )
                );
            });
        });
    };

    DashboardController.prototype.userListener = function(userId) {
        this.startConversationWithUser(userId);
        this.markMessageFromUserAsRead(userId);
    };

    // Обновляет данные пользователей - добавляет новые регистрации + обновляет онлайн статус + если
    // установлен флаг isConversation - обновляет сообщения пользователей
    DashboardController.prototype.updateUsers = function updateUsers() {
        var controllerRef = this;
        var uModuleRef = this.usersModule;
        var intermediateList = [];
        controllerRef.dataSourceModule.allUsersAPI
            .getAllUsers()
            .then(function(userList) {
                Object.keys(userList).map(function(userId) {
                    controllerRef.addUserToUsersArray(
                        userList[userId],
                        userId,
                        intermediateList
                    );
                    if (currentUserId) {
                        controllerRef.updateUserMessagesAndDisplayIt(
                            userList[currentUserId]
                        );
                    }
                });
            })
            .then(function() {
                uModuleRef.uList = intermediateList;
                if (filterBy) {
                    controllerRef.filter();
                }
                if (sortBy) {
                    controllerRef.sort();
                }
                controllerRef.setupUsersListeners(intermediateList);
            });
    };

    ///////// WORK CHAT_MODULE /////////

    // Открывает чат с юзером, загружает мессаджи юзера и отображает их
    DashboardController.prototype.startConversationWithUser = function startConversationWithUser(
        userId
    ) {
        var controllerRef = this;
        controllerRef.dataSourceModule.oneUserAPI
                    .getUserData(userId)
                    .then(function(data) {
                        controllerRef.updateUserMessagesAndDisplayIt(data);
                    });
    };

    // Обновлет массив сообщений в модуле чата и выводит их на экран
    DashboardController.prototype.updateUserMessagesAndDisplayIt = function updateUserMessagesAndDisplayIt(
        userList
    ) {
        var newMessageList = [];
        this.addMessageToMessageArray(userList, newMessageList);
        this.setNewMessagesCounter(userList);
        this.chatModule.updateMessageList(newMessageList);
        this.DOMVariables.chat.classList.remove(this.config.CSS_INVISIBLE_STYLE);
        this.chatModule.displayMessages();
        this.markMessageFromUserAsRead(currentUserId);
    };

    // data - объект данных пользователя на сервере
    DashboardController.prototype.addMessageToMessageArray = function addUserToUsersArray(
        userData,
        messageArray
    ) {
        var controllerRef = this;
        if(userData.messages) {
            Object.keys(userData.messages).map(function(key) {
                var messageObject;
                var message = userData.messages[key][0].message;
                var date = userData.messages[key][0].date;
                var sender = userData.messages[key][0].user;
                var isRead = true;
                messageObject = controllerRef.chatModule.createMessageObject(
                    message,
                    date,
                    sender,
                    isRead
                );
                messageArray.push(messageObject);
            });
        }
    };

    // data - объект данных пользователя на сервере
    DashboardController.prototype.setNewMessagesCounter = function(userData) {
        if (!userData.readLastMessage && userData.noReadMessage) {
            this.chatModule.newMessagesCounter = userData.noReadMessage.count;
        } else {
            this.chatModule.newMessagesCounter = 0;
            this.dataSourceModule.oneUserAPI.setField(
                currentUserId,
                "noReadMessage/count",
                0
            );
        }
    };

    DashboardController.prototype.sendMessageToUser = function sendMessageToUser() {
        var controllerRef = this;
        var value = controllerRef.getMessageFromInputElement();
        var messageDate = controllerRef.chatModule.getCurrentDate();
        var adminName = controllerRef.chatModule.config.DEFAULT_ADMIN_NAME;
        var messageObject = controllerRef.chatModule.createMessageObject(
            value,
            messageDate,
            adminName,
            false
        );

        controllerRef.chatModule.addMessageToMessageList(messageObject);
        controllerRef.chatModule.newMessagesCounter++;

        controllerRef.dataSourceModule.oneUserAPI.setAmountOfNoReadMessage(
            currentUserId,
            controllerRef.chatModule.newMessagesCounter
        );
        controllerRef.dataSourceModule.oneUserAPI.sendMessageToUser(
            currentUserId,
            messageObject
        );
        controllerRef.dataSourceModule.oneUserAPI.setField(
            currentUserId,
            "readLastMessage",
            false
        );

        controllerRef.chatModule.displayMessages();
    };

    DashboardController.prototype.getMessageFromInputElement = function() {
        var value = this.DOMVariables.messageInput.value;
        this.DOMVariables.messageInput.value = "";
        return value;
    };

    // Закрывает канал общения с юзером и чат
    DashboardController.prototype.closeConversation = function() {
        this.DOMVariables.chat.classList.add(this.config.CSS_INVISIBLE_STYLE);
        currentUserId = null;
        this.saveCurrentConditionToLocalStorage();
    };

    ///////// WORK WITH INTERVAL /////////

    DashboardController.prototype.setupIntervalFunctions = function() {
        var controllerRef = this;
        setInterval(function() {
            controllerRef.updateUsers();
        }, controllerRef.config.UPDATE_USERS_TIME);
        setInterval(function() {
            controllerRef.blinkNewMessageFromUsers();
        }, controllerRef.config.BLINK_NEW_MESSAGES_TIME);
    };

    dashboardControllerInstance = new DashboardController(
        userListManagerObject,
        chatManagerObject,
        dashboardDataSourceObject,
        configObject
    );
    return dashboardControllerInstance;
})(
    userListManager,
    chatManager,
    dashboardDataSource,
    dashboardControllerConfig
);

dashboardController.startApp();

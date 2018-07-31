/* global dataConnector */
/* global longPollResponseParser */
/* global mainConfig */
/* global mainConfig */
/* exported isPerformed */
/* exported isStartXHRConnection */
var instructionPerformer = (function createInstructionPerformer (config, dataConnector, parser) {

    /* exported connection */
    var isPerformed = false;
    var connection = null;
    var isStartXHRConnection = false;

    var instructionQueueManager = (function () {

        //= instructions/instructionQueueManagerBody.js

        return getAPI();

    })();

    var instructions = (function getInstructionList (config) {

        //= instructions/instructionListBody.js

        return getAPI();

    })(mainConfig);

    //= instructions/xhrInstructionConnector.js
    //= instructions/longPollingInstructionConnector.js

    //= instructions/instructionPerformerBody.js

    return {
        execute: executeCommand,
        startApp: startApplication,
        closeApp: closeApplication
    };

})(mainConfig, dataConnector, longPollResponseParser);
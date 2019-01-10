/* global dataConnector */
/* global longPollResponseParser */
/* global mainConfig */
/* global getAPI */
/* global startApplication */
/* global executeCommand */
/* global closeApplication */
/* exported instructionPerformer */
var instructionPerformer = (function createInstructionPerformer (config, connector, parser) { /* eslint-disable-line no-unused-vars */

    /* exported connection */
    var isPerformed = false; /* eslint-disable-line no-unused-vars */
    var connection = null; /* eslint-disable-line no-unused-vars */
    var isStartXHRConnection = false; /* eslint-disable-line no-unused-vars */

    var instructionQueueManager = (function () { /* eslint-disable-line no-unused-vars */

        //= instructions/instructionQueueManagerBody.js

        return getAPI();

    })();

    var instructions = (function getInstructionList (configObj, dataConnector) { /* eslint-disable-line no-unused-vars */

        //= instructions/instructionListBody.js

        return getAPI();

    })(config, connector);

    //= instructions/xhrInstructionConnector.js
    //= instructions/longPollingInstructionConnector.js

    //= instructions/instructionPerformerBody.js

    return {
        execute: executeCommand,
        startApp: startApplication,
        closeApp: closeApplication
    };

})(mainConfig, dataConnector, longPollResponseParser);
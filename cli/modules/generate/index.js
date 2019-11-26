const util = require("../../lib/util");
const { OPTIONS_ALL, USAGE } = require("./config");

module.exports = {
    run: async (operation) => {
        try {
            const userOptions = operation.options;
            const hasHelpOption = util.hasHelpOption(userOptions);
            const hasInvalidOption = util.hasInvalidOption(userOptions, OPTIONS_ALL);

            if(!hasHelpOption && !hasInvalidOption){
                // carry out generate logic here
                console.log(operation);
            } else {
                console.log(util.displayHelp(USAGE)); // show help menu
            }
            return;
        } catch (err) {
            if (err) {
                throw new Error(err);
            }    
        }
    }
}
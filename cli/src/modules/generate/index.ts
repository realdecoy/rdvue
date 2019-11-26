import util from "../../lib/util";
import config from"./config";

async function run(operation: any): Promise<any> {
    try {
        const userOptions = operation.options;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, config.OPTIONS_ALL);
        
        if(!hasHelpOption && !hasInvalidOption){
            // carry out generate logic here
            console.log(operation);
        } else {
            console.log(util.displayHelp(config.USAGE)); // show help menu
        }
        return;
    } catch (err) {
        if (err) {
            throw new Error(err);
        }    
    }
}

export default {
    run,
}
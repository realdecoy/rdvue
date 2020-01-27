test('populateCommand', done => {
    function callback(data) {
      expect(data).toBe('');
      done();
    }
  
    fetchData(callback);
  });

  async function populateCommand(command: string, required = false){
    let commandConfig: any = {};
    commandConfig = await files.readSubConfig(command);
    USAGE[command] = {};
    USAGE[command].config = commandConfig;
    // Dont add general help text if command is required for new project generation
    if(!required){
      USAGE.general.menu[1].content.push({
        name: `${chalk.magenta(command)}`,
        summary: commandConfig.description,
      });
    }
    USAGE[command].menu = CONFIG.USAGE_TEMPLATE(undefined, command, undefined);
    if (commandConfig.arguments !== undefined && commandConfig.arguments !== []) {
      USAGE[command].menu.splice(1, 0, {
        header: 'Arguments',
        content: [],
      });
      for (const argument of commandConfig.arguments) {
        USAGE[command].menu[1].content.push({
          name: `${chalk.magenta(argument.name)}`,
          summary: argument.description,
        });
      }
    }
  }
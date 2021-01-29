'use strict';
const CDP = require('chrome-remote-interface');
const main = async function () {

    const client = await CDP({ port: 9229 });

    await client.Runtime.enable();
    const ServerPrototypeResult = await client.Runtime.evaluate({expression:"require('http').Server.prototype", includeCommandLineAPI: true, returnByValue: false});

    const ServerInstanceListResult = await client.Runtime.queryObjects({ prototypeObjectId: ServerPrototypeResult.result.objectId });
    const ServerInstancesResult = await client.Runtime.getProperties({ objectId: ServerInstanceListResult.objects.objectId });

    const serverInstance = ServerInstancesResult.result[0].value.objectId;
    await client.Runtime.evaluate({expression:"process.patchListeners = require(`./toInject.js`).patchListeners", includeCommandLineAPI: true, returnByValue: false});

    await client.Runtime.callFunctionOn({ objectId: serverInstance, functionDeclaration: 'function() { process.patchListeners(this) }', returnByValue: true });
    await client.Runtime.evaluate({expression:"delete process.patchListeners", includeCommandLineAPI: true, returnByValue: false});

    await client.Runtime.evaluate({"expression":"require('inspector').close()","includeCommandLineAPI":true});
    await client.close();
};
main();

const newman = require('newman');
const { sendMessage } = require('./utils/gchatapi');

newman.run({
    collection: require('./collection/temp.postman_collection.json'),
    environment: require('./enviroment/TempEnviroment.postman_environment.json'),
    reporters: ['junit', 'cli'],
    reporter: { junit: { export: "newman-report.xml" } },
    bail: ['failure']
}, function (err, summary) {
    if (err) {
        throw err;
    };
    const title = `<b>Newman API AutoRun</b>`
    const subtitle = `<font color="#6C6C6C">postman-api-testing</font>`
    console.log(summary.run.failures)
    const messageTitle = `<font color="#00DB00">【 Executed Assertions 】: ${summary.run.stats.assertions.total}</font>
        <font color="#FF2D2D">【 Failed Assertions 】: ${summary.run.stats.assertions.failed}</font>`
    if (JSON.stringify(summary.run.failures) == JSON.stringify([])) {
        const message = messageTitle + "\n" + `<b>All tests have passed！！！</b>`
        sendMessage(title, subtitle, message)
        return;
    } else {
        const messageArr = []
        for (let i = 0; i < summary.run.failures.length; i++) {
            let message = `==================================================
                <font color="#FF8000">＃ 錯誤 ${i + 1}</font>
                【 VerifyName 】  ${summary.run.failures[i].error.test} 
                【 ErrorName 】  ${summary.run.failures[i].error.name}
                【 Message 】   ${summary.run.failures[i].error.message}
                【 Resource 】  ${summary.run.failures[i].source.name}`;

            messageArr.push(message)
        }
        const messageText = messageTitle + "\n" + `	<font color="#7B7B7B">${messageArr.join("\n")}</font>`

        sendMessage(title, subtitle, messageText)
    }
});

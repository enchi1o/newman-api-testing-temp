## Newman API testing template

### Dependencies
- [Node.js](https://nodejs.org/en/) 
- [Postman](https://www.postman.com/)
- [Newman](https://www.npmjs.com/package/newman)
- Docker 
- gitlab

### Project structure
```
Project
├─ utils                      // External function
├─ collection_dev             // DEV collection  
├─ collection_stag            // STAG collection
├─ collection_prod            // PROD collection
├─ environment                // environment.json collection
├─ file                       // file testdata 
├─ .gitignore                 
├─ package.json              
├─ runNewmanCommand.js      
└─ .gitlab-ci.yml
```

### 更新與維護流程
1. Clone 專案 
2. [更新] 在 Postman APP 寫完 Script 之後 export 放到指定環境的 collection 資料夾
3. [維護] 把需要維護的 collection import 到 Postman APP 維護後再 export 放回去取代
4. Push 回 Repository ( 依團隊 Version Controll Strategy 規範 )
5. 串接 CI Check Script 執行起來的狀況

### gitlab-ci.yml
```
stages:
  - test
  
postman_tests:
    stage: test
    image:
        name: postman/newman:latest
        entrypoint: [""]
    script:
        - newman --version
        # Execute the newman command
        - newman run $script.json -e $environment.json --reporters junit,cli --reporter-junit-export="newman-report.xml"
    artifacts:
        paths:
            - "*.xml"
        when: on_success
        expire_in: 7 days
        reports:
            # gitlab-ci junit report
            junit: newman-report.xml
```

### runNewmanCommand.js
```
const newman = require('newman');

async function newmanRun() {
    newman.run({
        collection: require(`$collection.json`),
        environment: require(`$environment.json`),
        reporters: ['junit', 'cli'],
        reporter: { junit: { export: `$ReportPath` } }
    }, function (err) {
        if (err) { throw err; }
        console.log('collection run complete!');
    });
};

newmanRun(); 
```
> [newman option](https://learning.postman.com/docs/running-collections/using-newman-cli/newman-options/)

### Integrate GoogleChat
<img width="550" alt="image" src="https://user-images.githubusercontent.com/108819681/212491902-b63f4894-99dd-4936-9b67-376c146d22ea.png">

**Send Message**
```
const axios = require(`axios`)

const sendMessage = (title, subtitle, body) => {
    // Pass incoming webhook URL with environment variable `WEBHOOK_URL`.
    const WEBHOOK_URL = `${YOUR_GCHAT_WEBHOOK}`
    const widget = { textParagraph: { text: body } }
    axios.post(WEBHOOK_URL, {
        cards: [
            {
                header: {
                    title: title,
                    // subtitle: subtitle,
                    imageUrl: `${HeaderImage}`
                },
                sections: [
                    {
                        widgets: [widget],
                    },
                ],
            },
        ],
    })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.error(err.toJSON())
        })
}

module.exports = {
    sendMessage
}
```

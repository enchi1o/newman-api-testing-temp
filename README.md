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

### Process for Updating and Maintaining:

1. Clone the project.
2. [Updating]: After writing the script in the Postman app, export it and place it in the designated environment's collection folder.
3. [Maintenance]: Import the collections that need maintenance into the Postman app, make necessary updates, then export them back to replace the originals.
4. Push changes back to the repository following the team's version control strategy.
5. Integrate with CI to check the script execution status.

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

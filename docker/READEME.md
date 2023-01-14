##### BUILD DOCKER
```
cd ./docker
docker build -t newman-node .
```

##### RUN DOCKER 

```
docker run --rm -v "$(PWD):/usr/src/app/scripts" node-newman node ./scripts/runTest.js
```

# Prerequisites
- AWS account,
- AWS cli,
- Express cli,
- GitLab account
- Git cli,
- Marvel developer account (http://developer.marvel.com/account)
- Visual Studio Code, 

# Create Project
```zsh
$ cd ~/your/workspace/api
$ express marvel-api
$ cd marvel-api
$ npm install
```

# Test Project
```zsh
$ DEBUG=marvel-api:* npm start
```

Go to http://localhost:3000/

# It's already time to commit
```zsh
$ git init
$ touch .gitignore
$ echo "node_module" > .gitignore
$ git add .
$ git commit -m "first commit"
$ git remote add origin git@gitlab.com:{{userid}}/marvel-api.git
```
##### For new account Add your SSH KEY on Gitlab
create/copy your public key : 
```zsh
$ pbcopy < ~/.ssh/id_rsa.pub 
```
paste it as a new key : https://gitlab.com/profile/keys

#### Push the master branch
```zsh
$ git push -u origin/master
```

### Configure Marvel access
- create an account
- verify your account
- generate an api key

### Install an http client
```zsh
$ npm i axios
```
### Install environement loading
```zsh
$ npm i dotenv
```

### Generate hash parameters
```zsh
$ npm i crypto
```
hash = md5(ts+privateKey+publicKey) cf. doc

### Test api call
```zsh
$ curl http://localhost:3000/characters 
```
and test output
```zsh
$ npm install --save-dev jest
$ npm install supertest --save-dev
$ npm run test
```
```zsh
result:
 PASS  __test__/characters.spec.js
  Testing the Marvel API
    ✓ test characters endpoint (1006 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.337 s
Ran all test suites.
GET /characters 200 984.584 ms - 46729
```


### Create dockerfiles, build, test local container, 
```zsh
$ docker build -t marvel-api .
$ docker run -it -p 3000:3000 marvel-api
```

### Login, Tag, and push to aws ECR.
```zsh
$ aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 724618579722.dkr.ecr.eu-central-1.amazonaws.com
$ docker tag marvel-api:latest 724618579722.dkr.ecr.eu-central-1.amazonaws.com/marvel-api:latest
$ docker push 724618579722.dkr.ecr.eu-central-1.amazonaws.com/marvel-api:latest              
```

## Create an ECS cluster
- type: **Mise en réseau uniquement**
- name: **marvel-cluster**

### Create task definition on ECS
- type : **EC2**
- name: **marvel-api-task**
- memory: **256**
- cpu: **128**

- Add a container:
name: **marvel-api**
image: **724618579722.dkr.ecr.eu-central-1.amazonaws.com/marvel-api:latest**
- **mappage des ports**: 
port hôte: **80** 
port du container: **3000**

- **environment variables**: 
MARVEL_API_PRIVATE_KEY: **your-private-api-key**
MARVEL_API_PUBLIC_KEY: **your-public-api-key**

### Create a service
- run type: **EC2**
- task: **marvel-api-task**
- cluster: **marvel-cluster**
- service type: **REPLICA**

When the service is ACTIVE go to "Instances ECS" tab in cluster and get his url:
- DNS public: **ec2-3-121-234-123.eu-central-1.compute.amazonaws.com**

Test api endpoint: 
http://ec2-3-121-234-123.eu-central-1.compute.amazonaws.com/characters

Now you can update your .env.production configuration file in your front project.
ex: VUE_APP_API_HOST='http://ec2-3-121-234-123.eu-central-1.compute.amazonaws.com/'
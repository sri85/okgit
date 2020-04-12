# okgit

![Build](https://github.com/sri85/okgit/workflows/Node.js%20CI/badge.svg?branch=master) [![Node version](https://img.shields.io/node/v/okgit.svg?style=flat)](http://nodejs.org/download/) [![NPM Version](https://badge.fury.io/js/esta.svg?style=flat)](https://npmjs.org/package/okgit)

A cli tool for interacting with Github(Gitlab,Bitbucket coming soon). The cli tool aims to speed up the dev productivity by allowing developers to interact with Github without having to leave their favorite commandline. The name is heavily inspired by voice assistant "Ok,Google".

## Installation
```
npm install okgit -g
```

## Features
[![Create Issue](https://i.imgur.com/hsaOc89.mp4)]
[![Create PullRequest](https://i.imgur.com/meSfMKm.mp4)]

## Configuration
okgit can be configured with one of the major cloud git providers
1. Github
2. Gitlab(Coming Soon)
3. Bitbucket(Coming Soon)

### Github
In order to configure `okgit` with [Github](https://github.com/) , first step would be to create a token
![Github Token](./assets/github-personal-token.png). Copy the token to a safe place(Please do not share the token with anyone else)

Now run `okgit config`

[![okgit config](https://i.imgur.com/8JstAko.mp4)]



## Features
`okgit` allows us to interact with the following Github Features
### Help
To view what ``okgit`` can do with pull requests just type 

````commandline
okgit --help
 
````
![Command Usage](./assets/okgit-help.png)
### PullRequest

````commandline
okgit pr <id> --help
 
````
![PR](./assets/okgit-pr.png)

### Issue

````commandline
okgit issue --help
 
````
![ISSUE](./assets/okgit-issue.png)

### Repo

````commandline
okgit repo --help
 
````
![Repo](./assets/okgit-repo.png)
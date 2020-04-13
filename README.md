# okgit

![Build](https://github.com/sri85/okgit/workflows/Node.js%20CI/badge.svg?branch=master) [![Node version](https://img.shields.io/node/v/okgit.svg?style=flat)](http://nodejs.org/download/) [![NPM Version](https://badge.fury.io/js/esta.svg?style=flat)](https://npmjs.org/package/okgit)

A cli tool for interacting with Github(Gitlab,Bitbucket coming soon). The cli tool aims to speed up the dev productivity by allowing devs to interact with Github/Bitbucket/Gitlab without having to leave their favorite commandline. The name is heavily inspired by voice assistant "Ok,Git".

# Mission 
Aim of `okgit` is to make developers comfortable by reducing the times that developer needs to reach the mouse to interact with Github/Gitlab/Bitbucket.(atleast that's the hope )

## Motivation
Why `okgit`?
Whilst there are tools out there to interact with **Github/Gitlab/Bitbucket**, `okgit` aims to be a single tool to interact with any of these services, without having to download or configure different tools .

## Security
`okgit` does not use /store the tokens , all the tokens that are used to continue to reside on the filesystem of your machine where `okgit` is installed.

## Installation
```
npm install okgit -g
```
The above command installs `okgit`, globally . Couple more steps, hang in there .

## Configuration
I know, you are excited to get your hands dirty with `okgit`, we will now proceed to configure the tool.
okgit can be configured with one of the major cloud git providers
1. Github
2. Gitlab(Coming Soon)
3. Bitbucket(Coming Soon)

Run `okgit config`, this will ask series of questions for you to get started.


### Github
In order to configure `okgit` with [Github](https://github.com/) , first step would be to create a token in Github.
Open Github in web browser(for one last time 😜) , Go to **Settings -> Developer Settings -> Personal Access Token** and click on
**Generate new token** Copy the token to a safe place(Please do not share the token with anyone else)

 Now run `okgit config`
 [![okgit-config](https://asciinema.org/a/8rsGr8p3LCGN7RlOVfMdroKOd.svg)](https://asciinema.org/a/8rsGr8p3LCGN7RlOVfMdroKOd)

## Features
[![asciicast](https://asciinema.org/a/StSI8hmTuKP20rR57aWPDchb4.svg)](https://asciinema.org/a/StSI8hmTuKP20rR57aWPDchb4) 
[![okgit create-pullrequest](https://asciinema.org/a/DTmeNPgxM75m7CriSxNhqPaxl.svg)](https://asciinema.org/a/DTmeNPgxM75m7CriSxNhqPaxl)


## Features
`okgit` allows us to interact with the cloud git providers(Github) features for now , without having to leave your terminal.
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


## Status
Currently `okgit` is in **Beta** Status which means there are edges that still need to be polished and do not hesitate to raise [issue](https://github.com/sri85/okgit/issues/new) when you encounter them. And also if you have any cool features that you would like to see in `okgit` , feel free to raise a [feature-request](https://github.com/sri85/okgit/issues/new)

### Running and building it locally
1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Build the app using `npm build`.
4. Install the app locally using `npm install ./ -g`

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![](https://gaforgithub.azurewebsites.net/api?repo=gaforgithub)](https://github.com/dgkanatsios/gaforgithub)

# Unofficial Google Analytics tracking for GitHub projects
This is an unofficial Google Analytics for GitHub repositories tracking using [Azure Functions](https://functions.azure.com) and written in Node.js. You can use this to track pageviews in all pages that contain Markdown, like READMEs, wikis etc.

## Motivation
GitHub has a mechanism by which you can see tracking information about your repositories, you can read about it [here](https://help.github.com/articles/viewing-traffic-to-a-repository/). However, it hosts data only for the last 14 days and there is no real time information.

#### Attention
GitHub uses camo to cache and serve images ([details](https://help.github.com/articles/about-anonymized-image-urls/)), so (a) tracking may not be accurate and (b) user details are hidden (IP, referer, etc.). 

## Instructions

1. Click [here](http://www.google.com/analytics/) to visit Google Analytics and create a new account
2. When you are done, copy your Tracking ID (should be in the format UA-XXXX-Y)
3. Click the button below to deploy the project in your Azure subscription

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdgkanatsios%2Fgaforgithub%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

4. When the deployment is completed, copy your Functions URL (should be something like `https://yourfunctionname.azurewebsites.net`)
5. Edit your README files in your repos that you want to track (or any files that contain markdown) and insert the necessary code.

First, change `YYYYYY` to your Azure Function's URL. Then, change `XXXXXXXX` to a distinctive name to use in order to track this specific page. Might be the name of your repo or whatever you like. If you want to display a button use this code:

```markdown
[![unofficial Google Analytics for GitHub](https://YYYYYY.azurewebsites.net/api?repo=XXXXXXXX)](https://github.com/dgkanatsios/gaforgithub)
```

If you do not want to display the button, use this code:

```markdown
![](https://YYYYYY.azurewebsites.net/api?repo=XXXXXXXX&empty)
```

## Cost

The deployment uses Azure Functions' [Consumption Plan](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale#consumption-plan) so you'll see that it's really cheap to host it for your projects.

## Inspiration

Inspired by igrorik's solution [here](https://github.com/igrigorik/ga-beacon) that works with Go language and Google App Engine.
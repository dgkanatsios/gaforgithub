[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![](https://gaforgithub.azurewebsites.net/api?repo=gaforgithub)](https://github.com/dgkanatsios/gaforgithub)

# gaforgithub
Google Analytics for GitHub repositories using Azure Functions


## Instructions

1. Click [here](http://www.google.com/analytics/) to visit Google Analytics and create a new account
2. When you are done, copy your Tracking ID (should be in the format UA-XXXX-Y)
3. Click the button below to deploy the project in your Azure subscription

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdgkanatsios%2Fgaforgithub%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

4. When the deployment is completed, copy your Functions URL (should be something like `https://yourfunctionname.azurewebsites.net`)
5. Edit your README files in your repos that you want to track (or any files that contain markdown) and insert the necessary code either 

```markdown
[![](https://gaforgithub.azurewebsites.net/api?repo=XXXXXXXX)](https://github.com/dgkanatsios/gaforgithub)
```

if you want the button to appear, or

```markdown
![](https://gaforgithub.azurewebsites.net/api?repo=XXXXXXXX&empty)
```
if you do not want the button.
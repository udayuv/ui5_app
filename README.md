## Step 1: Hello World!

- Create a folder on your local machine which will contain all the sources of the `app` we're going to build. We'll refer to this folder as the “app root folder”.
- Create a new file called `package.json` which will enable you to execute commands and consume packages from the npm registryInformation published on non SAP site via the npm command line interface. Enter the following content:

```json
{
    "name": "ui5.walkthrough",
    "version": "1.0.0",
    "private": true,
    "author": "SAP SE",
    "description": "UI5 Demo App - Walkthrough Tutorial",
    "scripts": {
      "start": "ui5 serve -o index.html"
    }
  }
  
```
- Create a new folder named `webapp` in the app root folder. It will contain all the sources that become available in the browser later. We'll refer to this folder as the "webapp folder".

- Create a new HTML file named `index.html` in your webapp folder and enter the following content:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>UI5 Walkthrough</title>
</head>
<body>
	<div>Hello World</div>
</body>
</html>
```

- Create a new file named `manifest.json` in the `webapp` folder, it's also known as the `app descriptor`. All application-specific configuration options which we'll introduce in this tutorial will be added to this file. Enter the following content:

```json
{
  "_version": "1.58.0",
  "sap.app": {
    "id": "ui5.walkthrough"
  }
}
```
- Open a terminal in the app root folder and execute `npm i -D @ui5/cli` to install UI5 Tooling.

- Execute `ui5 init` in the app root folder, this will create the `ui5.yaml` file in app root.
- If you get error `zsh: command not found: ui5` then install ui5 cli globally `npm install --global @ui5/cli` and then do `ui5 init` 

- Execute `npm start` to start the web server and to open a new browser window hosting your newly created index.html.
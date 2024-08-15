## Step 1: Hello World!

1. Create a folder on your local machine which will contain all the sources of the `app` we're going to build. We'll refer to this folder as the “app root folder”.
2. Create a new file called `package.json` which will enable you to execute commands and consume packages from the npm registryInformation published on non SAP site via the npm command line interface. Enter the following content:

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
3. Create a new folder named `webapp` in the app root folder. It will contain all the sources that become available in the browser later. We'll refer to this folder as the "webapp folder".

4. Create a new HTML file named `index.html` in your webapp folder and enter the following content:

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

5. Create a new file named `manifest.json` in the `webapp` folder, it's also known as the `app descriptor`. All application-specific configuration options which we'll introduce in this tutorial will be added to this file. Enter the following content:

```json
{
  "_version": "1.58.0",
  "sap.app": {
    "id": "ui5.walkthrough"
  }
}
```
6. Open a terminal in the app root folder and execute `npm i -D @ui5/cli` to install UI5 Tooling.

7. Execute `ui5 init` in the app root folder, this will create the `ui5.yaml` file in app root.
8. If you get error `zsh: command not found: ui5` then install ui5 cli globally `npm install --global @ui5/cli` and then do `ui5 init` 

9. Execute `npm start` to start the web server and to open a new browser window hosting your newly created index.html.

## Step 2: Bootstrap

Before we can do something with SAPUI5, we need to load and initialize it. This process of loading and initializing SAPUI5 is called bootstrapping. Once this bootstrapping is finished, we simply display an alert.

### UI5 Tooling
First, let's enhance your UI5 Tooling setup:

1. Open a terminal from the app root folder.
2. Execute `ui5 use OpenUI5` to add the framework name in ui5.yaml
3. Execute `ui5 add sap.ui.core sap.m themelib_sap_horizon` to add the libraries in ui5.yaml file.
   
`webapp/index.html`
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>UI5 Walkthrough</title>
	<script
		id="sap-ui-bootstrap"
		src="resources/sap-ui-core.js"
		data-sap-ui-theme="sap_horizon"
		data-sap-ui-libs="sap.m"
		data-sap-ui-compat-version="edge"
		data-sap-ui-async="true"
		data-sap-ui-on-init="module:ui5/walkthrough/index"
		data-sap-ui-resource-roots='{
			"ui5.walkthrough": "./"
		}'>

	</script>
</head>
<body>
<div>Hello World</div>
</body>
</html>
```

In this step, we load the SAPUI5 framework from the webserver provided by UI5 Tooling and initialize the core modules with the following configuration options:

- The id attribute of the `<script>` tag has to be exactly "sap-ui-bootstrap" to ensure proper booting of the SAPUI5 runtime.
- The src attribute of the `<script>` tag tells the browser where to find the SAPUI5 core library – it initializes the SAPUI5 runtime and loads additional resources, such as the libraries specified in the data-sap-ui-libs attribute.
- The SAPUI5 controls support different themes. We choose **sap_horizon** as our default theme.
- We specify the required UI library **sap.m**, which contains the UI controls we need for this tutorial
- To make use of the most recent functionality of SAPUI5 we define the compatibility version as **edge**
- We configure the bootstrapping process to run **asynchronously**. This means that the SAPUI5 resources can be loaded simultaneously in the background for performance reasons.
- We define the module to be loaded initially in a declarative way. With this, we avoid directly executable JavaScript code in the HTML file. This makes your app more secure. We'll create the script that this refers to further down in this step.
- We tell SAPUI5 core that resources in the ui5.walkthrough namespace are located in the same folder as index.html.

`webapp/index.js`
```js
sap.ui.define([], () => {
	"use strict";
	alert("UI5 is ready");
});
```

Now we create a new **index.js** script that contains the application logic for this tutorial step. We do this to avoid having executable code directly in the HTML file for security reasons. This script will be called from index.html. We defined it there as a module in a declarative way.

## Step 3: Controls

Now it is time to build our first little UI by replacing the “Hello World” text in the HTML body by the SAPUI5 control sap/m/Text. In the beginning, we will use the JavaScript control API to set up the UI, the control instance is then placed into the HTML body.

In `webapp/index.html` we will replace the body content with below code

```html
<body class="sapUiBody" id="content">
```    
The class **sapUiBody** adds additional theme-dependent styles for displaying SAPUI5 apps.

Now replace `webapp/index.js` content with below code

```js
sap.ui.define(["sap/m/Text"], (Text) => {
	"use strict";
	new Text({
		text: "Hello World"
	}).placeAt("content");
});
```

1. The `sap.ui.define` function take two arguments: an array of dependencies and a callback function. In this case, the dependency is the `sap/m/Text` module, which is a UI control in SAPUI5 used to display text. The callback function receives the `Text` module as an argument, allowing you to use it within the function.
2. Inside the callback function, the "use strict;" directive is used to enable strict mode, which helps catch common coding errors and improve performance
3. A new instance of the `Text` control is created with the `new Text()` contstuctor. 
4. The contructor takes an object as an argument, where the `text` property is set to "Hello World".
5. Finally the `placeAt` method is called on the `Text` instance with the argument "content". This method places the text control into the HTML element with the ID `content`.
6. This means that when the module is loaded, the text "Hello World" will be displayed in the specified HTML element on the web page.


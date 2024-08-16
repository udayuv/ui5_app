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

## Step 4: XML Views

Putting all our UI into the `index.js` file will very soon result in a messy setup, and there is quite a bit of work ahead of us. So let’s do a first modularization by putting the `sap/m/Text` control into a dedicated view.

SAPUI5 supports multiple view types (XML, HTML, JavaScript). When working with UI5, we recommend the use of XML, as this produces the most readable code and will force us to separate the view declaration from the controller logic. Yet the look of our UI will not change.

1. `webapp/view/App.view.xml` We create a new `view` folder in our webapp folder and a new file called `App.view.xml` inside this folder. 
2. The root node of the XML structure is the **View**. 
3. Here, we reference the default namespace **sap.m** where the majority of our UI assets are located. 
4. We define an additional **sap.ui.core.mvc** namespace with alias **mvc**, where the SAPUI5 views and all other Model-View-Controller (MVC) assets are located.
```xml
<mvc:View
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
</mvc:View>
```

**Note** : The namespace identifies all resources of the project and has to be unique. If you develop your own application code or controls, you cannot use the namespace prefix sap, because this namespace is reserved for SAP resources. Instead, simply define your own unique namespace (for example, myCompany.myApp).

5. `webapp/view/App.view.xml` Inside the **View** tag, we add the declarative definition of our **text** control with the same properties as in the previous step. 
6. The XML tags are mapped to controls, and the attributes are mapped to control properties.

<mvc:View
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <Text text="Hello World"/>
</mvc:View>

7. We replace the instantiation of the `sap/m/Text `control by our new `App.view.xml` file. The view is created by a factory function of SAPUI5. 
8. The name is prefixed with the namespace **ui5.walkthrough.view** in order to uniquely identify this resource, which is already given in manifest.json as unique id
```js
sap.ui.define(["sap/ui/core/mvc/XMLView"], (XMLView) => {
	"use strict";

	XMLView.create({
		viewName: "ui5.walkthrough.view.App"
	}).then((oView) => oView.placeAt("content"));
});
```
### Conventions
View names are capitalized

- All views are stored in the **view** folder
- Names of XML views always end with ***.view.xml**
- The default XML namespace is **sap.m**
- Other XML namespaces use the last part of the SAP namespace as alias (for example, mvc for sap.ui.core.mvc)

## Step 5: Controllers

In this step, we replace the text with a button and show the “Hello World” message when the button is pressed. The handling of the button's press event is implemented in the controller of the view.

`webapp/view/App.view.xml`
```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.App"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <Button
      text="Say Hello"
      press=".onShowHello"/>
</mvc:View>
```

1. We add a reference to the controller and replace the text control with a button with text “Say Hello”. 
2. The button triggers the .onShowHello event handler function when being pressed. We also have to specify the name of the controller that is connected to the view and holds the .onShowHello function by setting the controllerName attribute of the view. 
3. The controllerName is a combination of the namespace of your application followed by the actual name of the controller. We'll also use it in the next step when defining the controller.

A view does not necessarily need an explicitly assigned controller. You do not have to create a controller if the view is just displaying information and no additional functionality is required. If a controller is specified, it is instantiated after the view is loaded

`webapp/controller/App.controller.js (New)`

```js
sap.ui.define([
   "sap/ui/core/mvc/Controller"
], (Controller) => {
   "use strict";

   return Controller.extend("ui5.walkthrough.controller.App", {
      onShowHello() {
         // show a native JavaScript alert
         alert("Hello World");
      }
   });
});
```
- We create the folder **webapp/controller** and a new file `App.controller.js` inside. 
- We define the app controller in its own file by extending the UI5-provided **sap/ui/core/mvc/Controller**. 
- In the beginning, it holds only a single function called **onShowHello** that handles the button's press event by showing an alert.

### Conventions
Controller names are capitalized

- Controllers carry the same name as the related view (if there is a 1:1 relationship)
- Event handlers are prefixed with on
- Controller names always end with **.controller.js*

## Step 6: Modules

In SAPUI5, *resources* are often referred to as **modules**. In this step, we replace the alert from the last exercise with a proper Message Toast from the `sap.m` library. [ref](https://ui5.sap.com/#/topic/f665d0de4dba405f9af4294de824b03b)

`webapp/controller/App.controller.js`
```js
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], (Controller, MessageToast) => {
   "use strict";

   return Controller.extend("ui5.walkthrough.controller.App", {
      onShowHello() {
         MessageToast.show("Hello World");
      }
   });
});
```
1. We extend the array of required modules with the fully qualified path to `sap/m/MessageToast`. 
2. Once both modules, **Controller** and **MessageToast**, are loaded, the callback function is called, and we can make use of both objects by accessing the parameters passed to the function.
3. This Asynchronous Module Definition (AMD) syntax allows to clearly separate the module loading from the code execution and greatly improves the performance of the application. The browser can decide when and how the resources are loaded prior to code execution.

### Conventions
- Use *sap.ui.define* for controllers and all other JavaScript modules to define a global namespace. With the namespace, the object can be addressed throughout the application.
- Use *sap.ui.require* for asynchronously loading dependencies but without declaring a namespace, for example code that just needs to be executed, but does not need to be called from other code.
- Use the name of the artifact to load for naming the function parameters (without namespace).

## Step 7: JSON Model

Now that we have set up the view and controller, it’s about time to think about the **M** in *MVC*.
We will add an input field to our app, bind its value to the model, and bind the same value to the description of the input field. The description will be directly updated as the user types.

`webapp/controller/App.controller.js`
```js
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
   "use strict";

   return Controller.extend("ui5.walkthrough.controller.App", {
      onInit() {
         // set data model on view
         const oData = {
            recipient : {
               name : "World"
            }
         };
         const oModel = new JSONModel(oData);
         this.getView().setModel(oModel);
      },

      onShowHello() {
         MessageToast.show("Hello World");
      }
   });
});
```
1. We add an **onInit** function to the controller. This is one of SAPUI5’s lifecycle methods that is invoked by the framework when the controller is created, similar to the constructor of a control.
2. Inside the function we instantiate a JSON model. The data for the model only contains a single property for the **“recipient”**, and inside this it also contains one additional property for the **name**.
3. To be able to use this model from within the XML view, we call the *setModel* function on the view and pass on our newly created model. The model is now set on the view.
4. The message toast is just showing the static "Hello World" message. We will show how to load a translated text here in the next step.

`webapp/view/App.view.xml`
```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.App"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <Button
      text="Say Hello"
      press=".onShowHello"/>
   <Input
      value="{/recipient/name}"
      description="Hello {/recipient/name}"
      valueLiveUpdate="true"
      width="60%"/>
</mvc:View>
```
We add an **sap/m/Input** control to the view. With this, the user can enter a recipient for the greetings. We bind its value to a SAPUI5 model by using the declarative binding syntax for XML views:
1. The curly brackets **{…}** indicate that data is taken from the value of the recipient's object name property. This is called **"data binding"**.
2. **/recipient/name** declares the path in the model.




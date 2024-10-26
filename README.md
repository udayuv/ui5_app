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

##### Why JsonModel?
Because it is used for light weight purpose, if we want to show the static data.

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

## Step 8: Translatable Texts

In this step we move the texts of our UI to a separate resource file.

`webapp/i18n/i18n.properties (New)`
```js
showHelloButtonText=Say Hello
helloMsg=Hello {0}
```
1. We create the folder webapp/i18n and the file i18n.properties inside. 
2. The resolved bundle name is ui5.walkthrough.i18n, as we will see later. 
3. The properties file for texts contains name-value pairs for each element. You can add any number of parameters to the texts by adding numbers in curly brackets to them. These numbers correspond to the sequence in which the parameters are accessed (starting with 0).

In this tutorial we will only have one properties file. However, in real-world projects, you would have a separate file for each supported language with a suffix for the locale, for example i18n_de.properties for German, i18n_en.properties for English, and so on. When a user runs the app, SAPUI5 will load the language file that fits best to the user's environment.


`controller/App.controller.js`

```js
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], (Controller, MessageToast, JSONModel, ResourceModel) => {
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

         // set i18n model on view
         const i18nModel = new ResourceModel({
            bundleName: "ui5.walkthrough.i18n.i18n"
         });
         this.getView().setModel(i18nModel, "i18n");
      },

      onShowHello() {
         // read msg from i18n model
         const oBundle = this.getView().getModel("i18n").getResourceBundle();
         const sRecipient = this.getView().getModel().getProperty("/recipient/name");
         const sMsg = oBundle.getText("helloMsg", [sRecipient]);

         // show message
         MessageToast.show(sMsg);
      }
   });
});
```

1. In the `onInit` function we instantiate the `ResourceModel` that points to the new message bundle file where our texts are now located (i18n.properties file). 
2. The bundle name `ui5.walkthrough.i18n.i18n` consists of the application namespace ui5.walkthrough (the application root as defined in the index.html), the folder name i18n and finally the file name i18n without extension. 
3. The SAPUI5 runtime calculates the correct path to the resource; in this case the path to our i18n.properties file. 
4. Next, the model instance is set on the view as a named model with the key i18n. You use named models when you need to have several models available in parallel.
5. In the onShowHello event handler function we access the i18n model to get the text from the message bundle file and replace the placeholder {0} with the recipient from our data model. 
6. The getProperty method can be called in any model and takes the data path as an argument. In addition, the resource bundle has a specific getText method that takes an array of strings as second argument.
7. The resource bundle can be accessed with the getResourceBundle method of a ResourceModel. 
8. Rather than concatenating translatable texts manually, we can use the second parameter of getText to replace parts of the text with non-static data. During runtime, SAPUI5 tries to load the correct i18n_*.properties file based on your browser settings and your locale. 
9. In our case we have only created one i18n.properties file to make it simple. However, you can see in the network traffic of your browser’s developer tools that SAPUI5 tries to load one or more i18n_*.properties files before falling back to the default i18n.properties file.

`webapp/view/App.view.xml`
```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.App"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <Button
      text="{i18n>showHelloButtonText}"
      press=".onShowHello"/>
   <Input
      value="{/recipient/name}"
      description="Hello {/recipient/name}"
      valueLiveUpdate="true"
      width="60%"/>
</mvc:View>
```

In the XML view, we use data binding to connect the button text to the showHelloButtonText property in the i18n model. A resource bundle is a flat structure, therefore the preceding slash (/) can be omitted for the path.

### Conventions
The resource model for internationalization is called the i18n model.
- The default filename is i18n.properties.
- Resource bundle keys are written in (lower) camelCase.
- Resource bundle values can contain parameters like {0}, {1}, {2}, …
- Never concatenate strings that are translated, always use placeholders.
- Use Unicode escape sequences for special characters.

## Step 9: Component Configuration

After we have introduced all three parts of the Model-View-Controller (MVC) concept, we now come to another important structural aspect of SAPUI5.
In this step, we will encapsulate all UI assets in a component that is independent from our index.html file. 
- Components are independent and reusable parts used in SAPUI5 applications. 
- Whenever we access resources, we will now do this relatively to the component (instead of relatively to the index.html). 
- This architectural change allows our app to be used in more flexible environments than our static index.html page, such as in a surrounding container like the SAP Fiori launchpad.

We will create the `Component.js` file now and modify the related files in the app.

`webapp/Component.js (New)`
```js
sap.ui.define([
   "sap/ui/core/UIComponent"
], (UIComponent) => {
   "use strict";

   return UIComponent.extend("", {
      init() {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
      }
   });
});
```

- We create an initial `Component.js` file in the `webapp` folder that will hold our application setup. 
- The init function of the component is automatically invoked by SAPUI5 when the component is instantiated. 
- Our component inherits from the base class `sap/ui/core/UIComponent`, and it is obligatory to make the super call to the init function of the base class in the overridden init method.

`webapp/Component.js`
```js
sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], (UIComponent, JSONModel, ResourceModel) => {
   "use strict";

   return UIComponent.extend("ui5.walkthrough.Component", {
      metadata : {
         "interfaces": ["sap.ui.core.IAsyncContentCreation"],
         "rootView": {
            "viewName": "ui5.walkthrough.view.App",
            "type": "XML",
            "id": "app"
         }
      },

      init() {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
         // set data model
         const oData = {
            recipient : {
               name : "World"
            }
         };
         const oModel = new JSONModel(oData);
         this.setModel(oModel);

         // set i18n model
         const i18nModel = new ResourceModel({
            bundleName: "ui5.walkthrough.i18n.i18n"
         });
         this.setModel(i18nModel, "i18n");
      }
   });
});

```

The Component.js file now consists of two parts: 
- The new metadata section and 
- the previously introduced init function that is called when the component is initialized.

The metadata section defines a reference to the root view, so that instead of displaying the root view directly in the index.js file as we did previously, the component now manages the display of the app view. It also implements the sap.ui.core.IAsyncContentCreation interface, which allows the component to be created fully asynchronously.

**Note**: The `sap.ui.core.IAsyncContentCreation` interface implicitly sets both the component's rootView and its router configuration to "async": true; the latter will be described in Step 30: Routing and Navigation.

- In the init function we instantiate our data model and the i18n model like we did before in the app controller. 
- Be aware that the models are set directly on the component and not on the root view of the component. 
- However, as nested controls automatically inherit the models from their parent controls, the models are available on the view as well.

For example: `Component.js` is at app level
   - If Json model is defined in it, then it will directly get loaded when the app starts and will be available across the application level
   - If we define model inside any of the controller then it will be available only in that particular framework.

`webapp/controller/App.controller.js`

```js
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], (Controller, MessageToast) => {
   "use strict";

   return Controller.extend("ui5.walkthrough.controller.App", {
      onShowHello() {
         // read msg from i18n model
         const oBundle = this.getView().getModel("i18n").getResourceBundle();
         const sRecipient = this.getView().getModel().getProperty("/recipient/name");
         const sMsg = oBundle.getText("helloMsg", [sRecipient]);

         // show message
         MessageToast.show(sMsg);
      }
   });
});
```

Delete the `onInit` function and the required modules; this is now done in the component. You now have the code shown above.

`webapp\index.js`
```js
sap.ui.define([
	"sap/ui/core/ComponentContainer"
], (ComponentContainer) => {
	"use strict";

	new ComponentContainer({
		name: "ui5.walkthrough",
		settings : {
			id : "walkthrough"
		},
		async: true
	}).placeAt("content");
});
```
We now create a `ComponentContainer` instead of the view in our `index.js` that instantiates the view for us according to the component configuration.

### Conventions
- The component is named `Component.js`.
- Together with all UI assets of the app, the component is located in the `webapp` folder.
- The `index.html` file is located in the `webapp` folder if it is used productively.

## Step 10: Descriptor for Applications

- All application-specific configuration settings will now further be put in a separate descriptor file called manifest.json.
- This clearly separates the application coding from the configuration settings and makes our app even more flexible. For example, all SAP Fiori applications are realized as components and come with a descriptor file in order to be hosted in the SAP Fiori launchpad.
- The SAP Fiori launchpad acts as an application container and instantiates the app without having a local HTML file for the bootstrap. Instead, the descriptor file will be parsed and the component is loaded into the current HTML page. This allows several apps to be displayed in the same context. 
- Each app can define local settings, such as language properties, supported devices, and more. 
- And we can also use the descriptor file to load additional resources and instantiate models like our i18n resource bundle.

`webapp/manifest.json (New)`
```json
{
  "_version": "1.58.0",
  "sap.app": {
	"id": "ui5.walkthrough",
	"i18n": "i18n/i18n.properties",
	"title": "{{appTitle}}",
	"description": "{{appDescription}}",
	"type": "application",
	"applicationVersion": {
	  "version": "1.0.0"
	}
  },
  "sap.ui": {
	"technology": "UI5",
	"deviceTypes": {
		"desktop": true,
		"tablet": true,
		"phone": true
	}
  },
  "sap.ui5": {
	"dependencies": {
	  "minUI5Version": "1.108.0",
	  "libs": {
		"sap.ui.core": {},
		"sap.m": {}
	  }
	},
	"models": {
	  "i18n": {
		"type": "sap.ui.model.resource.ResourceModel",
		"settings": {
		  "bundleName": "ui5.walkthrough.i18n.i18n",
		  "supportedLocales": [""],
		  "fallbackLocale": ""
		}
	  }
	},
	"rootView": {
		"viewName": "ui5.walkthrough.view.App",
		"type": "XML",
		"id": "app"
	}
  }
}
```

**Note** : In this tutorial, we only introduce the most important settings and parameters of the descriptor file. In some development environments you may get validation errors because some settings are missing - you can ignore those in this context.

The content of the `manifest.json` file is a configuration object in JSON format that contains all global application settings and parameters. The manifest file is called the descriptor for applications, components, and libraries and is also referred to as “descriptor” or “app descriptor” when used for applications. It is stored in the webapp folder and read by SAPUI5 to instantiate the component. There are three important sections defined by namespaces in the manifest.json file:

**sap.app**
```json
"sap.app": {
	"id": "ui5.walkthrough",
	"i18n": "i18n/i18n.properties",
	"title": "{{appTitle}}",
	"description": "{{appDescription}}",
	"type": "application",
	"applicationVersion": {
	  "version": "1.0.0"
	}
```
- The sap.app namespace contains the following application-specific attributes:
  - *id* (mandatory): The namespace of our application component. The ID must not exceed 70 characters. It must be unique and must correspond to the component ID/namespace.
  - *type*: Defines what we want to configure; here: an application.
  - *i18n*: Defines the path to the resource bundle file. The supportedLocales and fallbackLocale properties are set to empty strings, as our demo app uses only one i18n.properties file for simplicity and we'd like to prevent the browser from trying to load additional i18n_*.properties files based on your browser settings and your locale.
  - *title*: Title of the application in handlebars syntax referenced from the app's resource bundle.
  - *description*: Short description text what the application does in handlebars syntax referenced from the app's resource bundle.
  - *applicationVersion*: The version of the application to be able to update the application easily later on.
 
**sap.ui**
```json
"sap.ui": {
	"technology": "UI5",
	"deviceTypes": {
		"desktop": true,
		"tablet": true,
		"phone": true
	}
  }
``` 
- The sap.ui namespace contributes the following UI-specific attributes:
  - *technology*: This value specifies the UI technology; in our case we use SAPUI5
  - *deviceTypes*: Tells what devices are supported by the app: desktop, tablet, phone (all true by default)

**sap.ui5**
```json
"sap.ui5": {
	"dependencies": {
	  "minUI5Version": "1.108.0",
	  "libs": {
		"sap.ui.core": {},
		"sap.m": {}
	  },
     "models":{....},
     "rootView":{....}
	}
``` 
- The sap.ui5 namespace adds SAPUI5-specific configuration parameters that are automatically processed by SAPUI5. The most important parameters are:
  - *rootView*: If you specify this parameter, the component will automatically instantiate the view and use it as the root for this component
  - *dependencies*: Here we declare the UI libraries used in the application
  - *models*: In this section of the descriptor we can define models that will be automatically instantiated by SAPUI5 when the app starts. 
    - Here we can now define the local resource bundle. We define the name of the model "i18n" as key and specify the bundle file by namespace. 
    - As in the previous steps, the file with our translated texts is stored in the i18n folder and named i18n.properties. 
    - We simply prefix the path to the file with the namespace of our app. 
    - The manual instantiation in the app component's init method will be removed later in this step. 
    - The supportedLocales and fallbackLocale properties are set to empty strings, as in this tutorial our demo app uses only one i18n.properties file for simplicity, and we'd like to prevent the browser from trying to load additional i18n_*.properties files based on your browser settings and your locale. 

For compatibility reasons the root object and each of the sections state the descriptor version number 1.58.0 under the internal property _version. Features might be added or changed in future versions of the descriptor and the version number helps to identify the application settings by tools that read the descriptor.

**Note**: Properties of the resource bundle are enclosed in two curly brackets in the descriptor. This is not a SAPUI5 data binding syntax, but a variable reference to the resource bundle in the descriptor in handlebars syntax. The referred texts are not visible in the app built in this tutorial but can be read by an application container like the SAP Fiori launchpad.

`webapp\index.html`

Now we declare our component in the body of our `index.html`. 
- In the bootstrapping script of our index.html, we enable the ComponentSupport module. 
  - `data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"` 
- Then, we declare our component in the body via a div tag. 
  - `<div data-sap-ui-component data-name="ui5.walkthrough" data-id="container" data-settings='{"id" : "walkthrough"}'></div>`
- This will instantiate the component when the onInit event is executed.
- We can delete our index.js, because the descriptor now takes care of everything.

`webapp/i18n/i18n.properties`
```
# App Descriptor
appTitle=Hello World
appDescription=A simple walkthrough app that explains the most important concepts of SAPUI5

# Hello Panel
showHelloButtonText=Say Hello
helloMsg=Hello {0}
```
In the resource bundle we simply add the texts for the app and add comments to separate the bundle texts semantically.

`webapp/Component.js`

- In the component's metadata section, we now replace the rootView property with the property key manifest and the value json.
  - ```
  metadata : {
         interfaces: ["sap.ui.core.IAsyncContentCreation"],
         manifest: "json"
      }
  ```
- This defines a reference to the descriptor that will be loaded and parsed automatically when the component is instantiated. 
- We can now completely remove the lines of code containing the model instantiation for our resource bundle. 
- It is done automatically by SAPUI5 with the help of the configuration entries in the descriptor. 
- We can also remove the dependency to `sap/ui/model/resource/ResourceModel` and the corresponding formal parameter ResourceModel because we will not use this inside our anonymous callback function.

**Tip ->** In previous versions of SAPUI5, additional configuration settings for the app, like the service configuration, the root view, and the routing configuration, had to be added to the metadata section of the Component.js file. As of SAPUI5 version 1.30, we recommend that you define these settings in the manifest.json descriptor file. Apps and examples that were created based on an older SAPUI5 version still use the Component.js file for this purpose - so it is still supported, but not recommended.

### Conventions
- The descriptor file is named manifest.json and located in the webapp folder.
- Use translatable strings for the title and the description of the app.

## Step 11: Pages and Panels

- After all the work on the app structure it’s time to improve the look of our app. 
- We will use two controls from the sap.m library to add a bit more "bling" to our UI. You will also learn about control aggregations in this step.

`webapp/view/App.view.xml`

```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.App"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc"
  displayBlock="true">
   <App>
      <pages>
         <Page title="{i18n>homePageTitle}">
            <content>
               <Panel
                  headerText="{i18n>helloPanelTitle}">
                  <content>
                     <Button
                        text="{i18n>showHelloButtonText}"
                        press=".onShowHello"/>
                     <Input
                        value="{/recipient/name}"
                        description="Hello {/recipient/name}"
                        valueLiveUpdate="true"
                        width="60%"/>
                  </content>
               </Panel>
            </content>
         </Page>
      </pages>
   </App>
</mvc:View>
```
- We put both the `input field` and the `button` inside a containing control called `sap/m/Page`. The page provides an aggregation to `0..N` other controls called `content`. 
- It also displays the `title` attribute in a header section on top of the content. 
- The `page` itself is placed into the pages aggregation of another control called `sap/m/App` which does the following important things for us:
  - It writes a bunch of properties into the header of the index.html that are necessary for proper display on mobile devices.
  - It offers functionality to navigate between pages with animations. We will use this soon.
- In order to make the fullscreen height of the view work properly, we add the displayBlock attribute with the value true to the view. The actual content is wrapped inside a Panel control, in order to group related content.

`webapp/i18n/i18n.properties`

```
# App Descriptor
appTitle=Hello World
appDescription=A simple walkthrough app that explains the most important concepts of SAPUI5

# Hello Panel
showHelloButtonText=Say Hello
helloMsg=Hello {0}
homePageTitle=Walkthrough
helloPanelTitle=Hello World
```

We add new key/value pairs to our text bundle for the start page title and the panel title.

## Step 12: Shell Control as Container

Now we use a shell control as container for our app and use it as our new root element. The shell takes care of visual adaptation of the application to the device’s screen size by introducing a so-called letterbox on desktop screens.

`webapp/view/App.view.xml`

```xml
<Shell>
   <App>...</App>
</Shell>
```
The shell control is now the outermost control of our app and automatically displays a so-called letterbox, if the screen size is larger than a certain width.

**Note** : We don't add the Shell control to the declarative UI definition in the XML view if apps run in an external shell, like the SAP Fiori launchpad that already has a shell around the component UI.

There are further options to customize the shell, like setting a custom background image or color and setting a custom logo. Check the related API [reference](https://ui5.sap.com/#/api/sap.m.Shell%23constructor) for more details. For example: `<Shell backgroundColor='red'>`

## Step 13: Margins and Paddings

Our app content is still glued to the corners of the letterbox. To fine-tune our layout, we can add margins and paddings to the controls that we added in the previous step.
Instead of manually adding CSS to the controls, we will use the standard classes provided by SAPUI5. These classes take care of consistent sizing steps, left-to-right support, and responsiveness.

`webapp/view/App.view.xml`
- To layout the panel, we add the CSS class `sapUiResponsiveMargin` that will add some space around the panel. We have to set the width of the panel to auto since the margin would otherwise be added to the default width of 100% and exceed the page size.
```xml
<Panel
   headerText="{i18n>helloPanelTitle}"
   class="sapUiResponsiveMargin"
   width="auto">
```
- If you decrease the screen size, then you can actually see that the margin also decreases. As the name suggests, the margin is responsive and adapts to the screen size of the device. Tablets will get a smaller margin and phones in portrait mode will not get a margin to save space on these small screens.
- Margins can be added to all kinds of controls and are available in many different options. We can even add space between the button and the input field by adding class `sapUiSmallMarginEnd` to the button.
```xml
<Button
   text="{i18n>showHelloButtonText}"
   press=".onShowHello"
   class="sapUiSmallMarginEnd"/>
```
- To format the output text individually, we remove the description from the input field and add a new `Text` control with the same value. Here we also use a small margin to align it with the other content. 
- Similarly, we could add the standard padding classes to layout the inner parts of container controls such as our panel, but as it already brings a padding by default, this is not needed here.
```xml
<Text
   text="Hello {/recipient/name}"
   class="sapUiSmallMargin"/>
```

### Conventions
- Use the standard SAPUI5 CSS classes for the layout if possible.

## Step 14: Custom CSS and Theme Colors

Sometimes we need to define some more fine-granular layouts and this is when we can use the flexibility of CSS by adding custom style classes to controls and style them as we like.

`webapp/css/style.css (New)`

```css
html[dir="ltr"] .myAppDemoWT .myCustomButton.sapMBtn {
   margin-right: 0.125rem
}

html[dir="rtl"] .myAppDemoWT .myCustomButton.sapMBtn {
   margin-left: 0.125rem
}

.myAppDemoWT .myCustomText {
   display: inline-block;
   font-weight: bold;
}
```
- We create a folder `css` which will contain our CSS files. In a new style definition file inside the css folder we create our custom classes combined with a custom namespace class. This makes sure that the styles will only be applied on controls that are used within our app.
- A button has a default margin of 0 that we want to override: We add a custom margin of 2px (or 0.125rem calculated relatively to the default font size of 16px) to the button with the style class `myCustomButton`. We add the CSS class `sapMBtn` to make our selector more specific: in CSS, the rule with the most specific selector "wins".
- For `right-to-left (rtl)` languages, like Arabic, you set the left margin and reset the right margin as the app display is inverted. If you only use standard SAPUI5 controls, you don't need to care about this, in this case where we use custom CSS, you have to add this information.
- In an additional class `myCustomText` we define a bold text and set the display to inline-block. This time we just define our custom class without any additional selectors. We do not set a color value here yet, we will do this in the view.

`webapp/manifest.json`
```json
...
  "sap.ui5": {
	...	
	"rootView": {
	  ...
	},
	"resources": {
	  "css": [
		{
		  "uri": "css/style.css"
		}
	  ]
	}
  }
```
- In the resources section of the `sap.ui5` namespace, additional resources for the app can be loaded. We load the CSS styles by defining a URI relative to the component. 
- SAPUI5 then adds this file to the header of the HTML page as a <link> tag, just like in plain Web pages, and the browser loads it automatically.

`webapp/view/App.view.xml`

- The app control is configured with our custom namespace class `myAppDemoWT` as `<App class="myAppDemoWT">`. This class has no styling rules set and is used in the definition of the CSS rules to define CSS selectors that are only valid for this app.
- We add our custom CSS class to the button `myCustomButton` to precisely define the space between the button and the input field. Now we have a pixel-perfect design for the panel content.
- To highlight the output `text`, we use a `FormattedText` control which can be styled individually, either by using custom CSS or with HTML code. We add our custom CSS class (myCustomText) and add a theme-dependent CSS class to set the highlight color that is defined in the theme.
  ```xml
  <FormattedText
      htmlText="Hello {/recipient/name}"
      class="sapUiSmallMargin sapThemeHighlight-asColor myCustomText"/>
  ```
- The actual color now depends on the selected theme which ensures that the color always fits to the theme and is semantically clear. For a complete list of the available CSS class names, see [CSS Classes for Theme Parameters](https://ui5.sap.com/#/topic/ea08f53503da42c19afd342f4b0c9ec7).

### Conventions
- Do not specify colors in custom CSS but use the standard theme-dependent classes instead.

## Step 15: Nested Views

Our panel content is getting more and more complex and now it is time to move the panel content to a separate view. With that approach, the application structure is much easier to understand, and the individual parts of the app can be reused.

`webapp/view/App.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.App"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	displayBlock="true">
	<Shell>
		<App class="myAppDemoWT">
			<pages>
				<Page title="{i18n>homePageTitle}">
					<content>
						<mvc:XMLView viewName="ui5.walkthrough.view.HelloPanel"/>
					</content>
				</Page>
			</pages>
		</App>
	</Shell>
</mvc:View>
```
Instead of putting the panel and its content directly into our App view, we will move it to a new separate `HelloPanel` view. We refer to this using an XMLView tag in the content aggregation of the panel.

`webapp/view/HelloPanel.view.xml (New)`
```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.HelloPanel"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <Panel
      headerText="{i18n>helloPanelTitle}"
      class="sapUiResponsiveMargin"
      width="auto">
      <content>
         <Button
            text="{i18n>showHelloButtonText}"
            press=".onShowHello"
            class="myCustomButton"/>
         <Input
            value="{/recipient/name}"
            valueLiveUpdate="true"
            width="60%"/>
         <FormattedText
            htmlText="Hello {/recipient/name}"
            class="sapUiSmallMargin sapThemeHighlight-asColor myCustomText"/>
      </content>
   </Panel>
</mvc:View>
```

The whole content for the panel is now added to the new file `HelloPanel.view.xml`. We also specify the controller for the view by setting the controllerName attribute of the XML view.

`webapp/controller/HelloPanel.controller.js (New)`
```js
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], (Controller, MessageToast) => {
   "use strict";

   return Controller.extend("ui5.walkthrough.controller.HelloPanel", {
      onShowHello() {
         // read msg from i18n model
         const oBundle = this.getView().getModel("i18n").getResourceBundle();
         const sRecipient = this.getView().getModel().getProperty("/recipient/name");
         const sMsg = oBundle.getText("helloMsg", [sRecipient]);

         // show message
         MessageToast.show(sMsg);
      }
   });
});
```

To have a reusable asset, the method `onShowHello` is also moved from the app controller to the HelloPanel controller.

`webapp/controller/App.controller.js`
```js
sap.ui.define([
   "sap/ui/core/mvc/Controller"
], (Controller) => {
   "use strict";

   return Controller.extend("ui5.walkthrough.controller.App", {
   });
});
```

We have now moved everything out of the app view and controller. The app controller remains an empty stub for now, we will use it later to add more functionality.

## Step 16: Dialogs and Fragments

In this step, we will take a closer look at another element which can be used to assemble views: the fragment.
- `Fragments` are light-weight UI parts (UI subtrees) which can be reused but do not have any controller. 
- This means, whenever you want to define a certain part of your UI to be reusable across multiple views, or when you want to exchange some parts of a view against one another under certain circumstances (different user roles, edit mode vs read-only mode), a fragment is a good candidate, especially where no additional controller logic is required.
- A fragment can consist of 1 to n controls. 
- At runtime, fragments placed in a view behave similar to "normal" view content, which means controls inside the fragment will just be included into the view’s DOM when rendered. 
- There are of course controls that are not designed to become part of a view, for example, dialogs. But even for these controls, fragments can be particularly useful, as you will see in a minute.

We will now add a dialog to our app. 
- Dialogs are special, because they open on top of the regular app content and thus do not belong to a specific view. 
- That means the dialog must be instantiated somewhere in the controller code, but since we want to stick with the declarative approach and create reusable artifacts to be as flexible as possible, we will create an XML fragment containing the dialog. 
- A dialog, after all, can be used in more than one view of your app.

`webapp/view/HelloPanel.view.xml`

```xml
<Button
         id="helloDialogButton"
         text="{i18n>openDialogButtonText}"
         press=".onOpenDialog"
         class="sapUiSmallMarginEnd"/>
```

- We add a new button to the view to open the dialog. 
- It simply calls an event handler function in the controller of the panel’s content view. We will need the new `id="helloDialogButton"` in [Step 28: Integration Test with OPA](https://sapui5.hana.ondemand.com/1.126.1/#/topic/9bf4dce43b7943d0909cd6c58a933589).
- It is a good practice to set a unique ID like `helloWorldButton` to key controls of your app so that can be identified easily. 
- If the id attribute is not specified, the OpenUI5 runtime generates unique but changing ID like "__button23" for the control. 
- Inspect the DOM elements of your app in the browser to see the difference.

`webapp/view/HelloDialog.fragment.xml (New)`
```xml
<core:FragmentDefinition
   xmlns="sap.m"
   xmlns:core="sap.ui.core">
   <Dialog
      id="helloDialog"
      title="Hello {/recipient/name}"/>
</core:FragmentDefinition>
```

We add a new XML file to declaratively define our dialog in a fragment. The fragment assets are located in the core namespace, so we add an xml namespace for it inside the FragmentDefinition tag.

The syntax is similar to a view, but since fragments do not have a controller this attribute is missing. Also, the fragment does not have any footprint in the DOM tree of the app, and there is no control instance of the fragment itself (only the contained controls). It is simply a container for a set of reuse controls.

`webapp/controller/HelloPanel.controller.js`

```js
async onOpenDialog() {
            // create dialog lazily
            this.oDialog ??= await this.loadFragment({
                name: "ui5.walkthrough.view.HelloDialog"
            });
        
            this.oDialog.open();
        }
```
Using async/await, we handle the opening of the dialog asynchronously every time the event is triggered.

If the dialog fragment does not exist yet, the fragment is instantiated by calling the loadFragment API. We then store the dialog on the controller instance. This allows us to reuse the dialog every time the event is triggered.

**Tip:** To reuse the dialog opening and closing functionality in other controllers, you can create a new file `ui5.walkthrough.controller.BaseController`, which extends `sap.ui.core.mvc.Controller`, and put all your dialog-related coding into this controller. Now, all the other controllers can extend from `ui5.walkthrough.controller.BaseController` instead of `sap.ui.core.mvc.Controller`.        

`webapp/i18n/i18n.properties`
We add a new text for the open button to the text bundle. `openDialogButtonText=Say Hello With Dialog`

## Step 17: Fragment Callbacks

Now that we have integrated the dialog, it's time to add some user interaction. The user will definitely want to close the dialog again at some point, so we add a button to close the dialog and assign an event handler.

`webapp/controller/HelloPanel.controller.js`
```js
onCloseDialog() {
			// note: We don't need to chain to the pDialog promise, since this event handler
			// is only called from within the loaded dialog itself.
			this.byId("helloDialog").close();
		}
```

The event handler function is put into the same controller file, and it closes the dialog by using the `byId` function to get the dialog instance and the close function to close the dialog.

`webapp/view/HelloDialog.fragment.xml`
```xml
<beginButton>
   <Button
      text="{i18n>dialogCloseButtonText}"
      press=".onCloseDialog"/>
</beginButton>
```

In the fragment definition, 
- we add a button to the `beginButton` aggregation of the dialog. 
- The press handler refers to an event handler called `.onCloseDialog`. 
- By using the `loadFragment` function to create the fragment content, the method will be invoked there when the button is pressed. 
- The dialog has an aggregation named beginButton as well as endButton. 
- Placing buttons in both of these aggregations makes sure that the `beginButton` is placed before the `endButton` on the UI. 
- What before means, however, depends on the text direction of the current language. We therefore use the terms begin and end as a synonym to “left” and “right". 
- In languages with left-to-right direction, the beginButton will be rendered left, the endButton on the right side of the dialog footer; in right-to-left mode for specific languages the order is switched.

`webapp/i18n/i18n.properties`

The text bundle is extended by the new text for the dialog’s close button. `dialogCloseButtonText=Ok`

## Step 18: Icons

Our dialog is still pretty much empty. Since SAPUI5 is shipped with a large icon font that contains more than 500 icons, we will add an icon to greet our users when the dialog is opened.

`webapp/view/HelloPanel.view.xml`
```xml
<Button
            id="helloDialogButton"
            icon="sap-icon://world"
            text="{i18n>openDialogButtonText}"
            press=".onOpenDialog"
            class="sapUiSmallMarginEnd"/>
```

We add an icon to the button `icon="sap-icon://world"` that opens the dialog. The `sap-icon://` protocol is indicating that an icon from the icon font should be loaded. The identifier world is the readable name of the icon in the icon font.

**Tip:** You can look up other icons using the [Icon Explorer tool](https://sapui5.hana.ondemand.com/1.126.1/test-resources/sap/m/demokit/iconExplorer/webapp/index.html).

To call any icon, use its name as listed in the Icon Explorer in `sap-icon://<iconname>`.

`webapp/view/HelloDialog.fragment.xml`
```xml
<core:FragmentDefinition
   xmlns="sap.m"
   xmlns:core="sap.ui.core" >
   <Dialog
      id="helloDialog"
      title ="Hello {/recipient/name}">
      <content>
         <core:Icon
            src="sap-icon://hello-world"
            size="8rem"
            class="sapUiMediumMargin"/>
      </content>
      <beginButton>
         ...
      </beginButton>
   </Dialog>
</core:FragmentDefinition>
```
In the dialog fragment, we add an icon control to the content aggregation of the dialog. Luckily, the icon font also comes with a “Hello World” icon that is perfect for us here. We also define the size of the icon and set a medium margin on it.

### Conventions
- Always use icon fonts rather than images wherever possible, as they are scalable without quality loss (vector graphics) and do not need to be loaded separately.

## Step 19: Aggregation Binding

Now that we have established a good structure for our app, it's time to add some more functionality. We start exploring more features of data binding by adding some invoice data in JSON format that we display in a list below the panel.

`webapp/Invoices.json (New)`

```json
{
    "Invoices": [
        {
            "ProductName": "Pineapple",
            "Quantity": 21,
            "ExtendedPrice": 87.2,
            "ShipperName": "Fun Inc.",
            "ShippedDate": "2015-04-01T00:00:00",
            "Status": "A"
        },
        {
            "ProductName": "Milk",
            "Quantity": 4,
            "ExtendedPrice": 10,
            "ShipperName": "ACME",
            "ShippedDate": "2015-02-18T00:00:00",
            "Status": "B"
        },
        {
            "ProductName": "Canned Beans",
            "Quantity": 3,
            "ExtendedPrice": 6.85,
            "ShipperName": "ACME",
            "ShippedDate": "2015-03-02T00:00:00",
            "Status": "B"
        },
        {
            "ProductName": "Salad",
            "Quantity": 2,
            "ExtendedPrice": 8.8,
            "ShipperName": "ACME",
            "ShippedDate": "2015-04-12T00:00:00",
            "Status": "C"
        },
        {
            "ProductName": "Bread",
            "Quantity": 1,
            "ExtendedPrice": 2.71,
            "ShipperName": "Fun Inc.",
            "ShippedDate": "2015-01-27T00:00:00",
            "Status": "A"
        }
    ]
}
```

- The `Invoices.json` file simply contains five invoices in a JSON format that we can use to bind controls against them in the `app`. 
- JSON is a very lightweight format for storing data and can be directly used as a data source for SAPUI5 applications.

`webapp/manifest.json`

```json
{
  ...
  "sap.ui5": {
    ...
    "models": {
      ...,
      "invoice": {
        "type": "sap.ui.model.json.JSONModel",
        "uri": "Invoices.json"
      }
    }
  }
  ...
}
```
- We add a new model `invoice` to the `sap.ui5` section of the descriptor. 
- This time we want a `JSONModel`, so we set the type to `sap.ui.model.json.JSONModel`. 
- The uri key is the path to our data relative to the component. 
- With this little configuration our component will automatically instantiate a new JSONModel which loads the invoice data from the Invoices.json file. 
- Finally, the instantiated JSONModel is put onto the component as a named model invoice. 
- The named model is then visible throughout our app.

`webapp/view/App.view.xml`
```xml
<mvc:XMLView
   viewName="ui5.walkthrough.view.InvoiceList"/>
```
In the app view we add a second view to display our invoices below the panel.

`webapp/view/InvoiceList.view.xml (New)`
```xml
<mvc:View
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <List
      headerText="{i18n>invoiceListTitle}"
      class="sapUiResponsiveMargin"
      width="auto"
      items="{invoice>/Invoices}" >
      <items>
         <ObjectListItem
            title="{invoice>Quantity} x {invoice>ProductName}"/>
      </items>
   </List>
</mvc:View>
```

- The new view is displaying a list control with a custom header text. 
- The item aggregation of the list is bound to the root path Invoices of the JSON data. And since we defined a named model, we have to prefix each binding definition with the identifier `invoice`.

- In the items aggregation, we define the template for the list that will be automatically repeated for each invoice of our test data. 
- More precisely, we use an `sap/m/ObjectListItem` to create a control for each aggregated child of the items aggregation
- The title property of the list item is bound to properties of a single invoice. This is achieved by defining a relative path (without / in the beginning). 
- This works because we have bound the items aggregation via `items={invoice>/Invoices}` to the invoices.

`webapp/i18n/i18n.properties`
```
# Invoice List
invoiceListTitle=Invoices
```
In the text bundle the title of the list is added.

## Step 20: Data Types

- The list of invoices is already looking nice, but what is an invoice without a price assigned? 
- Typically prices are stored in a technical format and with a '.' delimiter in the data model. For example, our invoice for pineapples has the calculated price 87.2 without a currency. 
- We are going to use the SAPUI5 data types to format the price properly, with a locale-dependent decimal separator and two digits after the separator.

`webapp/view/InvoiceList.view.xml`
```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.InvoiceList"
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc">
    <List
        headerText="{i18n>invoiceListTitle}"
        class="sapUiResponsiveMargin"
        width="auto"
        items="{invoice>/Invoices}">
        <items>
            <ObjectListItem
                title="{invoice>Quantity} x {invoice>ProductName}"
                number="{
                    parts: [
                        'invoice>ExtendedPrice',
                        'view>/currency'
                    ],
                    type: 'sap.ui.model.type.Currency',
                    formatOptions: {
                        showMeasure: false
                    }
                }"
                numberUnit="{view>/currency}"/>
        </items>
    </List>
</mvc:View>
```

- We add a price to our invoices list in the view by adding the number and numberUnit attributes to the ObjectListItem control, then we apply the currency data type on the number by setting the type attribute of the binding syntax to `sap.ui.model.type.Currency`.
- As you can see above, we are using a special binding syntax for the number property of the ObjectListItem. This binding syntax makes use of so-called "Calculated Fields", which allows the binding of multiple properties from different models to a single property of a control. 
- The properties bound from different models are called “parts”. 
  - In the example above, the `property` of the control is `number` and the `bound properties (“parts”)` retrieved from two different models are `invoice>ExtendedPrice` and `view>/currency`.
- We want to display the price in Euro, and typically the currency is part of our data model on the back end. In our case this is not the case, so we need to define it directly in the app. 
- We therefore add a controller for the invoice list, and use the currency property as the second part of our binding syntax. The Currency type will handle the formatting of the price for us, based on the currency code. In our case, the price is displayed with 2 decimals.
- Additionally, we set the formatting option `showMeasure` to `false`. This hides the currency code in the property number, because it is passed on to the ObjectListItem control as a separate property numberUnit.

`webapp/controller/InvoiceList.controller.js (New)`
```js
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		}
	});
});
```

To be able to access the currency code that is not part of our data model, we define a view model in the controller of the invoice list. It is a simple JSON model with just one key currency and the value EUR. This can be bound to the formatter of the number field. View models can hold any configuration options assigned to a control to bind properties such as the visibility.

#### Conventions
- Use data types instead of custom formatters whenever possible.

## Step 21: Expression Binding

Sometimes the predefined types of SAPUI5 are not flexible enough and you want to do a simple calculation or formatting in the view - that is where expressions are really helpful. We use them to format our price according to the current number in the data model.

`webapp/view/InvoiceList.view.xml`
```xml
numberState="{= ${invoice>ExtendedPrice} > 50 ? 'Error' : 'Success' }"/>
```

- We add the property `numberState` in our declarative view and introduce a new binding syntax that starts with `=` inside the brackets. This symbol is used to initiate a new binding syntax, it's called an expression and can do simple calculation logic like the ternary operator shown here.
- The condition of the operator is a value from our data model. A model binding inside an expression binding has to be escaped with the $ sign as you can see in the code. We set the state to "Error" (the number will appear in red) if the price is higher than 50 and to "Success" (the number will appear in green) otherwise.
- Expressions are limited to a particular set of operations that help formatting the data such as Math expression, comparisons, and such. You can look up the possible operations in the [documentation](https://ui5.sap.com/#/topic/daf6852a04b44d118963968a1239d2c0).

#### Conventions
- Only use expression binding for trivial calculations.

## Step 22: Custom Formatters

If we want to do a more complex logic for formatting properties of our data model, we can also write a custom formatting function. We will now add a localized status with a custom formatter, because the status in our data model is in a rather technical format.

`webapp/model/formatter.js (New)`
```js
sap.ui.define([], () => {
	"use strict";

	return {
		statusText(sStatus) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "A":
					return oResourceBundle.getText("invoiceStatusA");
				case "B":
					return oResourceBundle.getText("invoiceStatusB");
				case "C":
					return oResourceBundle.getText("invoiceStatusC");
				default:
					return sStatus;
			}
		}
	};
});
```

- We create a new folder model in our app project. The new formatter file is placed in the model folder of the app, because formatters are working on data properties and format them for display on the UI. So far we did not have any model-related artifacts, except for the Invoices.json file, we will now add the folder `webapp/model` to our app. This time we do not extend from any base object but just return a JavaScript object with our formatter functions inside the `sap.ui.define` call
- The `statusText` function gets the technical status from the data model as input parameter and returns the correct human-readable text from the resourceBundle file.

**Note**: In the above example, this refers to the controller instance as soon as the formatter gets called. We access the data model via the component using `this.getOwnerComponent().getModel()` instead of using `this.getView().getModel()`. The latter call might return undefined, because the view might not have been attached to the component yet, and thus the view can't inherit a model from the component.

`webapp/controller/InvoiceList.controller.js`
```js
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], (Controller, JSONModel, formatter) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		formatter: formatter,
		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		}
	});
});
```
To load our formatter functions, we have to add it to the InvoiceList.controller.js. In this controller, we first add a dependency to our custom formatter module. The controller simply stores the loaded formatter functions in the local property formatter to be able to access them in the view.

`webapp/view/InvoiceList.view.xml`
```xml
<firstStatus>
   <ObjectStatus
      text="{
            path: 'invoice>Status',
            formatter: '.formatter.statusText'
      }"/>
</firstStatus>
```

- We add a status using the `firstStatus` aggregation to our `ObjectListItem` that will display the status of our invoice.
- The custom formatter function is specified with the reserved property formatter of the binding syntax. A "." in front of the formatter name means that the function is looked up in the controller of the current view. There we defined a property formatter that holds our formatter functions, so we can access it by .formatter.statusText.

`webapp/i18n/i18n.properties`
```
invoiceStatusA=New
invoiceStatusB=In Progress
invoiceStatusC=Done
```
We add three new entries to the resource bundle that reflect our translated status texts. These texts are now displayed below the number attribute of the ObjectListItem dependent on the status of the invoice.

## Step 23: Filtering

In this step, we add a search field for our product list and define a filter that represents the search term. When searching, the list is automatically updated to show only the items that match the search term.

`webapp/view/InvoiceList.view.xml`
```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.InvoiceList"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <List
      id="invoiceList"
      class="sapUiResponsiveMargin"
      width="auto"
      items="{invoice>/Invoices}" >
      <headerToolbar>
         <Toolbar>
            <Title text="{i18n>invoiceListTitle}"/>
            <ToolbarSpacer/>
            <SearchField 
               width="50%" 
               search=".onFilterInvoices"/>
         </Toolbar>
      </headerToolbar>
      ...
</mvc:View>
```
- The view is extended by a search control that we add to the list of invoices. We also need to specify an ID invoiceList for the list control to be able to identify the list, from the event handler function `onFilterInvoices` that we add to the search field. 
- In addition, the search field is part of the list header and therefore, each change on the list binding will trigger a rerendering of the whole list, including the search field.
- The headerToolbar aggregation replaces the simple title property that we used before for our list header. A toolbar control is way more flexible and can be adjusted as you like. We are now displaying the title on the left side with a sap.m.Title control, a spacer, and the sap.m.SearchField on the right.

`webapp/controller/InvoiceList.controller.js`
```js
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (Controller, JSONModel, formatter, Filter, FilterOperator) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		formatter: formatter, 

		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		},

		onFilterInvoices(oEvent) {
			// build filter array
			const aFilter = [];
			const sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			const oList = this.byId("invoiceList");
			const oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}
	});
});
```
- We load two new dependencies for the filtering. The `filter` object will hold our configuration for the filter action and the `FilterOperator` is a helper type that we need in order to specify the filter.
- In the `onFilterInvoices` function we construct a filter object from the search string that the user has typed in the search field. Event handlers always receive an event argument that can be used to access the parameters that the event provides. 
- In our case the search field defines a parameter query that we access by calling `getParameter("query")` on the oEvent parameter.
- If the query is not empty, we add a new filter object to the still empty array of filters. However, if the query is empty, we filter the binding with an empty array. This makes sure that we see all list elements again. We could also add more filters to the array, if we wanted to search more than one data field. 
- In our example, we just search in the ProductName path and specify a filter operator that will search for the given query string.
- The list is accessed with the ID that we have specified in the view, because the control is automatically prefixed by the view ID, we need to ask the view for the control with the helper function byId. On the list control we access the binding of the aggregation items to filter it with our newly constructed filter object. This will automatically filter the list by our search string so that only the matching items are shown when the search is triggered. The filter operator `FilterOperator.Contains` is not case-sensitive.

## Step 24: Sorting and Grouping

To make our list of invoices even more user-friendly, we sort it alphabetically instead of just showing the order from the data model. Additionally, we introduce groups and add the company that ships the products so that the data is easier to consume.

`webapp/view/InvoiceList.view.xml`
```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.InvoiceList"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <List
      id="invoiceList"
      class="sapUiResponsiveMargin"
      width="auto"
      items="{
         path : 'invoice>/Invoices',
         sorter : {
            path : 'ProductName' 
         }
      }" >
      ...
   </List>
</mvc:View>
```
- We add a declarative sorter to our binding syntax. 
- As usual, we transform the simple binding syntax to the object notation, specify the path to the data, and now add an additional sorter property. 
- We specify the data path by which the invoice items should be sorted, and UI5 will take care of the rest. By default, the sorting is ascending, but you could also add a property descending with the value true inside the sorter property to change the sorting order.

If we run the app now we can see a list of invoices sorted by the name of the products.

`webapp/view/InvoiceList.view.xml`
```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.InvoiceList"
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc">
    <List
        id="invoiceList"
        headerText="{i18n>invoiceListTitle}"
        class="sapUiResponsiveMargin"
        width="auto"
        items="{
            path : 'invoice>/Invoices',
            sorter : {
                path : 'ShipperName',
                group : true
            }

        }">
        ...
    </List>
</mvc:View>
```
We modify the view and add a different sorter, or better; we change the sorter and set the attribute group to true. We also specify the path to the ShipperName data field. This groups the invoice items by the shipping company.

As with the sorter, no further action is required. The list and the data binding features of SAPUI5 will do the trick to display group headers automatically and categorize the items in the groups. We could define a custom group header factory if we wanted by setting the groupHeaderFactory property, but the result looks already fine.

## Step 25: Remote OData Service

So far we have worked with local JSON data, but now we will access a real OData service to visualize remote data.

In the real world, data often resides on remote servers and is accessed via an OData service. We will add a data source configuration to the manifest and replace the JSONModel type for our invoice model with the publicly available Northwind OData service to visualize remote data. You will be surprised how little needs to be changed in order to make this work!

**Note :** If you cannot get it to run, don't worry too much, the remaining steps will also work with the local JSON data you have used so far. In Step 26: Mock Server Configuration, you will learn how to simulate a back-end system to achieve a similar working scenario. However, you should at least read this chapter about remote OData services to learn about non-local data sources.

#### Install Proxy Server
- In this step, we want to use the publicly available Northwind OData service located at https://services.odata.org/V2/Northwind/Northwind.svc/. 
- Therefore, our URI points to the official Northwind OData service. In order to avoid cross-origin resource sharing, the typical procedure is to use a proxy in UI5 Tooling and maintain only a path in the URI property of the data source of our app.

- A bunch of proxy solutions are available from the UI5 community as [UI5 Tooling custom middleware extensions](http://help.sap.com/disclaimer?site=https://bestofui5.org/#/packages?tokens=proxy:tag). In this tutorial we'll use [ui5-middleware-simpleproxyInformation](http://help.sap.com/disclaimer?site=https://bestofui5.org/#/packages/ui5-middleware-simpleproxy) published on non SAP site. Open a new terminal window in your app root folder and execute `npm i -D ui5-middleware-simpleproxy` to install this package as a new development dependency in your package.json.

`ui5.yaml`
```
specVersion: '3.0'
metadata:
  name: ui5.walkthrough
type: application
framework:
  name: OpenUI5
  version: "1.128.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: themelib_sap_horizon
server:
  customMiddleware:
  - name: ui5-middleware-simpleproxy
    afterMiddleware: compression
    mountPath: /V2
    configuration:
      baseUri: "https://services.odata.org"
```

The ui5.yaml configuration file was automatically generated in the app root folder during Step 1 of this tutorial when we executed the ui5 init command. We now configure our proxy in the ui5.yaml file. The mountPath property configures which URLs will be caught by the proxy. The configuration/baseUri property stores the real server address.

`webapp/manifest.json`
```json
{
	...
	"sap.app": {
		...,
		"dataSources": {
			"invoiceRemote": {
				"uri": "V2/Northwind/Northwind.svc/",
				"type": "OData",
				"settings": {
					"odataVersion": "2.0"
				}
			}
		}
	},
	...
	"sap.ui5": {
		...
		"models": {
			...
			"invoice": {
				"dataSource": "invoiceRemote"
			}
		}
		...
```
In the sap.app section of the descriptor file, we add a data source configuration. With the invoiceRemote key, we specify a configuration object that allows automatic model instantiation. We specify the type of the service (OData) and the model version (2.0).

In the models section, we replace the content of the invoice model. This key is still used as model name when the model is automatically instantiated during the component initialization. However, the invoiceRemote value of the dataSource key is a reference to the data source section that we specified above. This configuration allows the component to retrieve the technical information for this model during the start-up of the app.

Our component now automatically creates an instance of sap.ui.model.odata.v2.ODataModel according to the settings we specified above, and makes it available as a model named invoice. When you use the invoiceRemote data source, the ODataModel fetches the data from the real Northwind OData service. The invoices we receive from the Northwind OData service have identical properties as the JSON data we used previously (except for the status property, which is not available in the Northwind OData service).

**Note:** If you want to have a default model on the component, you can change the name of the model to an empty string in the descriptor file. Automatically instantiated models can be retrieved by calling this.getModel in the component. In the controllers of component-based apps you can call this.getView().getModel() to get the automatically instantiated model. For retrieving a named model you have to pass on the model name defined in the descriptor file to getModel, that is, in the component you would call this.getModel("invoice") to get our automatically generated invoice model that we defined in the descriptor.

## Step 26: Mock Server Configuration

We just ran our app against a real service, but for developing and testing our app we do not want to rely on the availability of the “real” service or put additional load on the system where the data service is located.

This system is the so-called back-end system that we will now simulate with an SAPUI5 feature called mock server. It serves local files, but it simulates a back-end system more realistically than just loading the local data. We will also change the model instantiation part so that the model is configured in the descriptor and instantiated automatically by SAPUI5. This way, we do not need to take care of the model instantiation in the code.

`webapp/test/mockServer.html (New)`

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>SAPUI5 UI5 Walkthrough - Mockserver Test Page</title>
	<script
		id="sap-ui-bootstrap"
		src="../resources/sap-ui-core.js"
		data-sap-ui-theme="sap_horizon"
		data-sap-ui-compat-version="edge"
		data-sap-ui-async="true"
		data-sap-ui-on-init="module:ui5/walkthrough/test/initMockServer"
		data-sap-ui-resource-roots='{
			"ui5.walkthrough": "../"
		}'>
	</script>
</head>
<body class="sapUiBody" id="content">
	<div data-sap-ui-component data-name="ui5.walkthrough" data-id="container" data-settings='{"id" : "walkthrough"}'></div>

</body>
</html>
```

- We copy the `index.html` to a separate file in the `webapp/test` folder and name it `mockServer.html`. 
- We will now use this file to run our app in test mode with mock data loaded from a JSON file. 
- Test pages should not be placed in the application root folder but in a subfolder called `test` to clearly separate *productive* and *test* coding.

- From this point on, you have two different entry pages: One for the real “connected” app (index.html) and one for local testing (mockServer.html). 
- You can freely decide if you want to do the next steps on the real service data or on the local data within the app.

- We modify the mockServer.html file and change the page title to distinguish it from the productive start page. 
- In the bootstrap, the `data-sap-ui-resource-roots` property is also changed. 
- The namespace now points to the folder above ("../"), because the mockServer.html file is now in a subfolder of the webapp folder. Instead of loading the app component directly, we now call a script initMockServer.js.

`webapp/test/initMockServer.js (New)`
```js
sap.ui.define([
	"../localService/mockserver"
], (mockserver) => {
	"use strict";

	// initialize the mock server
	mockserver.init();

	// initialize the embedded component on the HTML page
	sap.ui.require(["sap/ui/core/ComponentSupport"]);
});
```
- The first dependency is a file called `mockserver.js` that will be located in the localService folder later.
- The mockserver depencency that we are about to implement is our local test server. Its init method is immediately called before we load the component. This way we can catch all requests that would go to the "real" service and process them locally by our test server when launching the app with the mockServer.html file. 
- The component itself does not "know" that it will now run in test mode.

`webapp/localService/mockdata/Invoices.json (New)`
```json
[
  {
	"ProductName": "Pineapple",
	"Quantity": 21,
	"ExtendedPrice": 87.2,
	"ShipperName": "Fun Inc.",
	"ShippedDate": "2015-04-01T00:00:00",
	"Status": "A"
  },
  {
	"ProductName": "Milk",
	"Quantity": 4,
	"ExtendedPrice": 10,
	"ShipperName": "ACME",
	"ShippedDate": "2015-02-18T00:00:00",
	"Status": "B"
  },
  {
	"ProductName": "Canned Beans",
	"Quantity": 3,
	"ExtendedPrice": 6.85,
	"ShipperName": "ACME",
	"ShippedDate": "2015-03-02T00:00:00",
	"Status": "B"
  },
  {
	"ProductName": "Salad",
	"Quantity": 2,
	"ExtendedPrice": 8.8,
	"ShipperName": "ACME",
	"ShippedDate": "2015-04-12T00:00:00",
	"Status": "C"
  },
  {
	"ProductName": "Bread",
	"Quantity": 1,
	"ExtendedPrice": 2.71,
	"ShipperName": "Fun Inc.",
	"ShippedDate": "2015-01-27T00:00:00",
	"Status": "A"
  }
]
```

- The Invoices.json file is similar to our previous file in the webapp folder. Just copy the content and remove the outer object structure with the key invoices so that the file consists of one flat array of invoice items. 
- This file will automatically be read by our server later in this step.
- Remove the old Invoices.json file from the webapp folder, it is no longer used.

`webapp/localService/metadata.xml (New)`
```xml
<edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx">
	<edmx:DataServices m:DataServiceVersion="1.0" m:MaxDataServiceVersion="3.0"
			xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
		<Schema Namespace="NorthwindModel" xmlns="http://schemas.microsoft.com/ado/2008/09/edm">
			<EntityType Name="Invoice">
				<Key>
					<PropertyRef Name="ProductName"/>
					<PropertyRef Name="Quantity"/>
					<PropertyRef Name="ShipperName"/>
				</Key>
				<Property Name="ShipperName" Type="Edm.String" Nullable="false" MaxLength="40" FixedLength="false"
							Unicode="true"/>
				<Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" FixedLength="false"
							Unicode="true"/>
				<Property Name="Quantity" Type="Edm.Int16" Nullable="false"/>
				<Property Name="ExtendedPrice" Type="Edm.Decimal" Precision="19" Scale="4"/>
				<Property Name="Status" Type="Edm.String" Nullable="false" MaxLength="1" FixedLength="false"
							Unicode="true"/>
			</EntityType>
		</Schema>
		<Schema Namespace="ODataWebV2.Northwind.Model" xmlns="http://schemas.microsoft.com/ado/2008/09/edm">
			<EntityContainer Name="NorthwindEntities" m:IsDefaultEntityContainer="true" p6:LazyLoadingEnabled="true"
					xmlns:p6="http://schemas.microsoft.com/ado/2009/02/edm/annotation">
				<EntitySet Name="Invoices" EntityType="NorthwindModel.Invoice"/>
			</EntityContainer>
		</Schema>
	</edmx:DataServices>
</edmx:Edmx>
```

- The metadata file contains information about the service interface and does not need to be written manually. 
- It can be accessed directly from the “real” service by calling the service URL and adding `$metadata` at the end (e.g. in our case http://services.odata.org/V2/Northwind/Northwind.svc/$metadata). 
- The mock server will read this file to simulate the real OData service, and will return the results from our local source files in the proper format so that it can be consumed by the app (either in XML or in JSON format).

For simplicity, we have removed all content from the original Northwind OData metadata document that we do not need in our scenario. We have also added the status field to the metadata since it is not available in the real Northwind service.

`webapp/localService/mockserver.js (New)`
```js
sap.ui.define([
	"sap/ui/core/util/MockServer"
], (MockServer) => {
	"use strict";

	return {
		init() {
			// create
			const oMockServer = new MockServer({
				rootUri: sap.ui.require.toUrl("ui5/walkthrough") + "/V2/Northwind/Northwind.svc/"
			});

			const oUrlParams = new URLSearchParams(window.location.search);

			// configure mock server with a delay
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUrlParams.get("serverDelay") || 500
			});

			// simulate
			const sPath = sap.ui.require.toUrl("ui5/walkthrough/localService");
			oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");

			// start
			oMockServer.start();
		}
	};
});
```

- Now that we have added the OData service description file metadata.xml file, we can write the code to initialize the mock server which will then simulate any OData request to the real Northwind server.
- We load the standard SAPUI5 MockServer module as a dependency and create a helper object that defines an init method to start the server. This method is called before the component initialization in the mockServer.html file above. The init method creates a MockServer instance with the same URL as the real service calls.
- The URL in the rootUri configuration parameter has to point to the same URL as defined in the uri property of the data source in the manifest.json descriptor file. In the manifest.json, UI5 automatically interprets a relative URL as being relative to the application namespace. In the JavaScript code, you can ensure this by using the sap.ui.require.toUrl method. The sap/ui/core/util/MockServer then catches every request to the real service and returns a response. Next, we set two global configuration settings that tell the server to respond automatically and introduce a delay of 500 ms to imitate a typical server response time. Otherwise, we would have to call the respond method on the MockServer manually to simulate the call.
- To simulate a service, we can simply call the simulate method on the MockServer instance with the path to our newly created metadata.xml. This will read the test data from our local file system and set up the URL patterns that will mimic the real service.
- Finally, we call start on oMockServer. From this point, each request to the URL pattern rootUri will be processed by the MockServer. If you switch from the index.html file to the mockServer.html file in the browser, you can now see that the test data is displayed from the local sources again, but with a short delay. The delay can be specified with the URI parameter serverDelay.
- This approach is perfect for local testing, even without any network connection. This way your development does not depend on the availability of a remote server, i.e. to run your tests.
- Try calling the app with the index.html file and the mockServer.html file to see the difference. If the real service connection cannot be made, for example when there is no network connection, you can always fall back to the local test page.

`package.json`
For easier local development, we adjust the start script in the package.json to open mockServer.html instead of index.html:
```json

{
  "name": "ui5.walkthrough",
  "version": "1.0.0",
  "description": "The UI5 walkthrough application",
  "scripts": {
      "start": "ui5 serve -o test/mockServer.html"
  },
  "devDependencies": {
    "@ui5/cli": "^3",
    "ui5-middleware-simpleproxy": "^3"
  }
}
```
#### Conventions
- The webapp/test folder contains non-productive code only.
- Mock data and the script to start the MockServer are stored in the webapp/localService folder.
- The script to start the MockServer is called mockserver.js.


## Step 27: Unit Test with QUnit

- Actually, every feature that we added to the app so far, would require a separate test case. 
- We have totally neglected this so far, so let’s add a simple unit test for our custom formatter function from Step 22. 
- We will test if the long text for our status is correct by comparing it with the texts from our resource bundle.


#### Folder Structure for this Step
- We add a new folder `unit` under the test folder and a `model` subfolder where we will place our formatter unit test. 
- The folder structure matches the app structure to easily find the corresponding unit tests.

`webapp/test/unit/model/formatter.js (New)`
```js
sap.ui.define([
	"ui5/walkthrough/model/formatter",
	"sap/ui/model/resource/ResourceModel",
], (formatter, ResourceModel) => {
	"use strict";

	QUnit.module("Formatting functions", {});

	QUnit.test("Should return the translated texts", (assert) => {
        const oResourceModel = new ResourceModel({
            bundleUrl: sap.ui.require.toUrl("ui5/walkthrough/i18n/i18n.properties"),
            supportedLocales: [
                ""
            ],
            fallbackLocale: ""
        });

        const oControllerMock = {
            getOwnerComponent() {
                return {
                    getModel() {
                        return oResourceModel;
                    }
                };
            }
        };

        const fnIsolatedFormatter = formatter.statusText.bind(oControllerMock);

        // Assert
        assert.strictEqual(fnIsolatedFormatter("A"), "New", "The long text for Status A is correct");
        assert.strictEqual(fnIsolatedFormatter("B"), "In Progress", "The long text for Status B is correct");
        assert.strictEqual(fnIsolatedFormatter("C"), "Done", "The long text for Status C is correct");
        assert.strictEqual(fnIsolatedFormatter("Foo"), "Foo", "The long text for Status Foo is correct");
	});
});
```

- We create a new `formatter.js` file under webapp/test/unit/model where the unit test for the custom formatter is implemented. The formatter file that we want to test is loaded as a dependency.
- The formatter file just contains one `QUnit` module for our formatter function and one unit test for the formatter function. 
- In the implementation of the statusText function that we created in Step 22, we use the translated texts when calling the formatter. 
- As we do not want to test the UI5 binding functionality, we just use text in the test instead of a ResourceBundle.
- Finally, we perform our assertions. We check each branch of the formatter logic by invoking the isolated formatter function with the values that we expect in the data model (A, B, C, and everything else). We strictly compare the result of the formatter function with the hard-coded strings that we expect from the resource bundle and give a meaningful error message if the test should fail.

`webapp/test/unit/unitTests.qunit.html (New)`
```html
<!DOCTYPE html>
<html>
<head>
	<title>Unit tests for UI5 Walkthrough</title>
	<meta charset="utf-8">

	<script
		id="sap-ui-bootstrap"
		src="../../resources/sap-ui-core.js"
		data-sap-ui-resource-roots='{
			"ui5.walkthrough": "../../"
		}'
		data-sap-ui-async="true">
	</script>

	<link rel="stylesheet" type="text/css" href="../../resources/sap/ui/thirdparty/qunit-2.css">

	<script src="../../resources/sap/ui/thirdparty/qunit-2.js"></script>
	<script src="../../resources/sap/ui/qunit/qunit-junit.js"></script>

	<script src="unitTests.qunit.js"></script>
</head>
<body>
	<div id="qunit"/>
	<div id="qunit-fixture"/>
</body>
</html>
```

The so-called QUnit test suite is an HTML page that triggers all QUnit tests for the application. Most of it is generating the layout of the result page that you can see in the preview and we won’t further explain these parts but focus on the application parts instead.

Let’s start with the namespaces. Since we are now in the webapp/test/unit folder, we actually need to go up two levels to get the webapp folder again. This namespace can be used inside the tests to load and trigger application functionality.

First, we load some basic QUnit functionality via script tags. Other QUnit tests can be added here as well. Then the HTML page loads another script called unitTests.qunit.js, which we will create next. This script will execute our formatter.

`webapp/test/unit/unitTests.qunit.js (New)`
```js
QUnit.config.autostart = false;

sap.ui.require(["sap/ui/core/Core"], async(Core) => {
	"use strict";

	await Core.ready();

	sap.ui.require([
		"ui5/walkthrough/test/unit/model/formatter"
	], () => {
		QUnit.start();
	});
});
```

This script loads and executes our formatter. If we now open the webapp/test/unit/unitTests.qunit.html file in the browser, we should see our test running and verifying the formatter logic.

#### Conventions
- All unit tests are placed in the webapp/test/unit folder of the app.
- Files in the test suite end with *.qunit.html.
- The unitTests.qunit.html file triggers all unit tests of the app.
- A unit test should be written for formatters, controller logic, and other individual functionality.
- All dependencies are replaced by stubs to test only the functionality in scope.

## Step 30: Routing and Navigation
So far, we have put all app content on one single page. As we add more and more features, we want to split the content and put it on separate pages.

In this step, we will use the SAPUI5 navigation features to load and show a separate detail page that we can later use to display details for an invoice. In the previous steps, we defined the page directly in the app view so that it is displayed when the app is loaded. We will now use the SAPUI5 router class to load the pages and update the URL for us automatically. We specify a routing configuration for our app and create a separate view for each page of the app, then we connect the views by triggering navigation events.

`webapp/manifest.json`

```json
{
  ...
  "sap.ui5": {
  ...
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "type": "View",
        "viewType": "XML",
        "path": "ui5.walkthrough.view",
        "controlId": "app",
        "controlAggregation": "pages"
      },
      "routes": [
        {
          "pattern": "",
          "name": "overview",
          "target": "overview"
        },
        {
          "pattern": "detail",
          "name": "detail",
          "target": "detail"
        }
      ],
      "targets": {
        "overview": {
          "id": "overview",
          "name": "Overview"
        },
        "detail": {
          "id": "detail",
          "name": "Detail"
        }
      }
    }
  }
}
```

- We add a new “routing" section to the sap.ui5 part of the descriptor. There are three subsections that define the routing and navigation structure of the app:

**config**

- This section contains the global router configuration and default values that apply for all routes and targets. We define the router class that we want to use and where our views are located in the app. To load and display views automatically, we also specify which control is used to display the pages and what aggregation should be filled when a new page is displayed.

**routes**

- Each route defines a name, a pattern, and one or more targets to navigate to when the route has been hit. The pattern is basically the URL part that matches to the route, we define two routes for our app. The first one is a default route that will show the overview page with the content from the previous steps, and the second is the detail route with the URL pattern detail that will show a new page.

**targets**

- A target defines a view, or even another component, that is displayed; it is associated with one or more routes, and it can also be displayed manually from within the app. Whenever a target is displayed, the corresponding view is loaded and shown in the app. In our app we simply define two targets with a view name that corresponds to the target name.

`webapp/Component.js`

```js
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], (UIComponent, JSONModel) => {
	"use strict";

	return UIComponent.extend("ui5.walkthrough.Component", {

		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		},

		init() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set data model
			const oData = {
				recipient: {
					name: "World"
				}
			};
			const oModel = new JSONModel(oData);
			this.setModel(oModel);

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});
```

- In the component initialization method, we now add a call to initialize the router. We do not need to instantiate the router manually, it is automatically instantiated based on our AppDescriptor configuration and assigned to the component.

- Initializing the router will evaluate the current URL and load the corresponding view automatically. This is done with the help of the routes and targets that have been configured in the manifest.json, also known as the app descriptor. If a route has been hit, the view of its corresponding target is loaded and displayed.

`webapp/view/Overview.view.xml (New)`
```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.App"
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc"
    displayBlock="true">
    <Page title="{i18n>homePageTitle}">
        <content>
            <mvc:XMLView viewName="ui5.walkthrough.view.HelloPanel" />
            <mvc:XMLView viewName="ui5.walkthrough.view.InvoiceList" />
        </content>
    </Page>
</mvc:View>
```

We move the content of the previous steps from the App view to a new Overview view. For simplicity, we do not change the controller as it only contains our helper method to open the dialog, that means we reuse the controller `ui5.walkthrough.controller.App` for two different views (for the new overview and for the app view). However, two instances of that controller are instantiated at runtime. In general, one instance of a controller is instantiated for each view that references the controller.

`webapp/view/App.view.xml`
```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.App"
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc"
    displayBlock="true">
    <Shell>
        <App
            class="myAppDemoWT"
            id="app"/>
    </Shell>
</mvc:View>
```

Our App view is now only containing the empty app tag. The router will automatically add the view that corresponds to the current URL into the app control. The router identifies the app control with the ID that corresponds to the property controlId: “app” in the AppDescriptor.

`webapp/view/Detail.view.xml (New)`
```xml
<mvc:View
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>detailPageTitle}">
		<ObjectHeader title="Invoice"/>
	</Page>
</mvc:View>
```

Now we add a second view for the detail view. It only contains a page and an ObjectHeader control that displays the static text Invoice for now.

`webapp/i18n/i18n.properties`
```
…
# Invoice List
invoiceListTitle=Invoices
invoiceStatusA=New
invoiceStatusB=In Progress
invoiceStatusC=Done

# Detail Page
detailPageTitle=Walkthrough - Details
We add a new string to the resource bundle for the detail page title.
```

`webapp/view/InvoiceList.view.xml`
```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.InvoiceList"
    xmlns="sap.m"
    xmlns:core="sap.ui.core"
    xmlns:mvc="sap.ui.core.mvc">
    ...
        <items>
            <ObjectListItem
                ...
                numberState="{= ${invoice>ExtendedPrice} > 50 ? 'Error' : 'Success' }"
                type="Navigation"
                press=".onPress" >
            </ObjectListItem>
        </items>
    </List>
</mvc:View>
```
In the invoice list view we add a press event to the list item and set the item type to Navigation so that the item can actually be clicked.

`webapp/controller/InvoiceList.controller.js`
```js
sap.ui.define([
	...
], (Controller, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {

		…

		onPress() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detail");
		}
	});
});
```

We add the event handler function to the controller of our invoices list. Now it is time to navigate to the detail page by clicking an item in the invoice list. We access the router instance for our app by calling the helper method `getOwnerComponent().getRouter()`. On the router we call the `navTo` method to navigate to the detail route that we specified in the routing configuration.

You should now see the detail page when you click an item in the list of invoices.

### Conventions
Define the routing configuration in the descriptor

Initialize the router at the end of your Component#init function

## Step 31: Routing with Parameters

We can now navigate between the overview and the detail page, but the actual item that we selected in the overview is not displayed on the detail page yet. A typical use case for our app is to show additional information for the selected item on the detail page.

To make this work, we have to pass over the information which item has been selected to the detail page and show the details for the item there.

`webapp/manifest.json`
```json
{
  …
  "sap.ui5": {
	…
	"routing": {
	  "config": {
		...
	  },
	  "routes": [
		{
		  "pattern": "",
		  "name": "overview",
		  "target": "overview"
		},
		{
		  "pattern": "detail/{invoicePath}",
		  "name": "detail",
		  "target": "detail"
		}
	  ],
		  "targets": {
		...
	  }
	}
  }
}
```

We now add a navigation parameter *invoicePath* to the detail route so that we can hand over the information for the selected item to the detail page. Mandatory navigation parameters are defined with curly brackets.

`webapp/view/Detail.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.Detail"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>detailPageTitle}">
		<ObjectHeader
			intro="{invoice>ShipperName}"
			title="{invoice>ProductName}"/>
	</Page>
</mvc:View>
```

We add a controller that will take care of setting the item's context on the view and bind some properties of the ObjectHeader to the fields of our invoice model. We could add more detailed information from the invoice object here, but for simplicity reasons we just display two fields for now.

`webapp/controller/InvoiceList.controller.js`
```js
sap.ui.define([
	...
], (Controller, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		…
		onPress(oEvent) {
			...,
         const oItem = oEvent.getSource();
			oRouter.navTo("detail", {
				invoicePath: window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substr(1))
			});
		}
	});
});
```

- The control instance that has been interacted with can be accessed by the *getSource* method that is available for all SAPUI5 events. It will return the ObjectListItem that has been clicked in our case. We will use it to pass the information of the clicked item to the detail page so that the same item can be displayed there.

- In the **navTo** method we now add a configuration object to fill the navigation parameter invoicePath with the current information of the item. This will update the URL and navigate to the detail view at the same time. On the detail page, we can access this context information again and display the corresponding item.

- To identify the object that we selected, we would typically use the key of the item in the back-end system because it is short and precise. 
- For our invoice items however, we do not have a simple key and directly use the binding path to keep the example short and simple. The path to the item is part of the binding context which is a helper object of SAPUI5 to manage the binding information for controls. The binding context can be accessed by calling the getBindingContext method with the model name on any bound SAPUI5 control. We need to remove the first / from the binding path by calling .substr(1) on the string because this is a special character in URLs and is not allowed, we will add it again on the detail page. Also, the binding path might contain special characters which are not allowed in URLs, so we have to encode the path with encodeURIComponent.

`webapp/controller/Detail.controller.js (New)`

```js
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], (Controller) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.Detail", {
		onInit() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched(oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
				model: "invoice"
			});
		}
	});
});
```

- Our last piece to fit the puzzle together is the detail controller. It needs to set the context that we passed in with the URL parameter *invoicePath* on the view, so that the item that has been selected in the list of invoices is actually displayed, otherwise, the view would simply stay empty.

- In the onInit method of the controller we fetch the instance of our app router and attach to the detail route by calling the method *attachPatternMatched* on the route that we accessed by its name. We register an internal callback function *onObjectMatched* that will be executed when the route is hit, either by clicking on the item or by calling the app with a URL for the detail page.

- In the *onObjectMatched* method that is triggered by the router we receive an event that we can use to access the URL and navigation parameters. The arguments parameter will return an object that corresponds to our navigation parameters from the route pattern. We access the invoicePath that we set in the invoice list controller and call the bindElement function on the view to set the context. We have to add the root / in front of the path again that was removed for passing on the path as a URL parameter. Because we have encoded the binding path part in the URL before, we have to decode it again with decodeURIComponent.

- The **bindElement** function is creating a binding context for a SAPUI5 control and receives the model name as well as the path to an item in a configuration object. This will trigger an update of the UI controls that we connected with fields of the invoice model. You should now see the invoice details on a separate page when you click on an item in the list of invoices.

### Conventions
- Define the routing configuration in the manifest.json / app descriptor
- Initialize the router at the end of your Component#init function

## Step 32: Routing Back and History

Now we can navigate to our detail page and display an invoice, but we cannot go back to the overview page yet. We'll add a back button to the detail page and implement a function that shows our overview page again.

`webapp/view/Detail.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.Detail"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>detailPageTitle}"
		showNavButton="true"
		navButtonPress=".onNavBack">
		...
	</Page>
</mvc:View>
```

On the detail page, we tell the control to display a back button by setting the parameter **showNavButton** to true and register an event handler that is called when the back button is pressed.

`webapp/controller/Detail.controller.js`
```js
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], (Controller, History) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.Detail", {

		onInit() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched(oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
				model: "invoice"
			});
		},

		onNavBack() {
			const oHistory = History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("overview", {}, true);
			}
		}
	});
});
```

- We load a new dependency called *History* that helps us to manage the navigation history from the `sap.ui.core.routing` namespace and add the implementation for the event handler to our detail page controller.

- In the event handler we access the navigation history and try to determine the previous hash. In contrast to the browser history, we will get a valid result only if a navigation step inside our app has already happened. Then we will simply use the browser history to go back to the previous page. 
- If no navigation has happened before, we can tell the router to go to our overview page directly. The third parameter true tells the router to replace the current history state with the new one since we actually do a back navigation by ourselves. The second parameter is an empty array ({}) as we do not pass any additional parameters to this route.

- This implementation is a bit better than the browser’s back button for our use case. The browser would simply go back one step in the history even though we were on another page outside of the app. In the app, we always want to go back to the overview page even if we came from another link or opened the detail page directly with a bookmark. You can try it by loading the detail page in a new tab directly and clicking on the back button in the app, it will still go back to the overview page.

#### Conventions
- Add a path to go back to the parent page when the history state is unclear.

## Step 33: Custom Controls

In this step, we are going to extend the functionality of SAPUI5 with a custom control. We want to rate the product shown on the detail page, so we create a composition of multiple standard controls using the SAPUI5 extension mechanism and add some glue code to make them work nicely together. This way, we can reuse the control across the app and keep all related functionality in one module.

`webapp/control/ProductRating.js (New)`
```js
sap.ui.define([
	"sap/ui/core/Control"
], (Control) => {
	"use strict";

	return Control.extend("ui5.walkthrough.control.ProductRating", {
		metadata : {},

		init() {},

		renderer(oRM, oControl) {}
	});
});
```
We create a new folder control and a file ProductRating.js that will hold our new control. As with our controllers and views, the custom control inherits the common control functionality from a SAPUI5 base object, for controls this is done by extending the base class sap.ui.core.Control.

Custom controls are small reuse components that can be created within the app very easily. Due to their nature, they are sometimes also referred to as "notepad” or “on the fly” controls. A custom control is a JavaScript object that has two special sections (metadata and renderer) and a number of methods that implement the functionality of the control.

The metadata section defines the data structure and thus the API of the control. With this meta information on the properties, events, and aggregations of the control SAPUI5 automatically creates setter and getter methods and other convenience functions that can be called within the app.

The renderer defines the HTML structure that will be added to the DOM tree of your app whenever the control is instantiated in a view. It is usually called initially by the core of SAPUI5 and whenever a property of the control is changed. The parameter oRM of the render function is the SAPUI5 render manager that can be used to write strings and control properties to the HTML page.

The init method is a special function that is called by the SAPUI5 core whenever the control is instantiated. It can be used to set up the control and prepare its content for display.


**Note :** *Controls always extend sap.ui.core.Control and render themselves. You could also extend sap.ui.core.Element or sap.ui.base.ManagedObject directly if you want to reuse life cycle features of SAPUI5 including data binding for objects that are not rendered. Please refer to the API reference to learn more about the inheritance hierarchy of controls.*

`webapp/control/ProductRating.js`

```js
sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/RatingIndicator",
	"sap/m/Label",
	"sap/m/Button"
], (Control, RatingIndicator, Label, Button) => {
	"use strict";

	return Control.extend("ui5.walkthrough.control.ProductRating", {
		metadata : {
			properties : {
				value: 	{type : "float", defaultValue : 0}
			},
			aggregations : {
				_rating : {type : "sap.m.RatingIndicator", multiple: false, visibility : "hidden"},
				_label : {type : "sap.m.Label", multiple: false, visibility : "hidden"},
				_button : {type : "sap.m.Button", multiple: false, visibility : "hidden"}
			},
			events : {
				change : {
					parameters : {
						value : {type : "int"}
					}
				}
			}
		},

		init() {
			this.setAggregation("_rating", new RatingIndicator({
				value: this.getValue(),
				iconSize: "2rem",
				visualMode: "Half",
				liveChange: this._onRate.bind(this)
			}));
			this.setAggregation("_label", new Label({
				text: "{i18n>productRatingLabelInitial}"
			}).addStyleClass("sapUiSmallMargin"));
			this.setAggregation("_button", new Button({
				text: "{i18n>productRatingButton}",
				press: this._onSubmit.bind(this)
			}).addStyleClass("sapUiTinyMarginTopBottom"));
		},

		setValue(fValue) {
			this.setProperty("value", fValue, true);
			this.getAggregation("_rating").setValue(fValue);

			return this;
		},

		reset() {
			const oResourceBundle = this.getModel("i18n").getResourceBundle();

			this.setValue(0);
			this.getAggregation("_label").setDesign("Standard");
			this.getAggregation("_rating").setEnabled(true);
			this.getAggregation("_label").setText(oResourceBundle.getText("productRatingLabelInitial"));
			this.getAggregation("_button").setEnabled(true);
		},

		_onRate(oEvent) {
			const oRessourceBundle = this.getModel("i18n").getResourceBundle();
			const fValue = oEvent.getParameter("value");

			this.setProperty("value", fValue, true);

			this.getAggregation("_label").setText(oRessourceBundle.getText("productRatingLabelIndicator", [fValue, oEvent.getSource().getMaxValue()]));
			this.getAggregation("_label").setDesign("Bold");
		},

		_onSubmit(oEvent) {
			const oResourceBundle = this.getModel("i18n").getResourceBundle();

			this.getAggregation("_rating").setEnabled(false);
			this.getAggregation("_label").setText(oResourceBundle.getText("productRatingLabelFinal"));
			this.getAggregation("_button").setEnabled(false);
			this.fireEvent("change", {
				value: this.getValue()
			});
		},
		renderer(oRm, oControl) {
			oRm.openStart("div", oControl);
			oRm.class("myAppDemoWTProductRating");
			oRm.openEnd();
			oRm.renderControl(oControl.getAggregation("_rating"));
			oRm.renderControl(oControl.getAggregation("_label"));
			oRm.renderControl(oControl.getAggregation("_button"));
			oRm.close("div");
		}
	});
});
```

We now enhance our new custom control with the custom functionality that we need. In our case we want to create an interactive product rating, so we define a value and use three internal controls that are displayed updated by our control automatically. A RatingIndicator control is used to collect user input on the product, a label is displaying further information, and a button submits the rating to the app to store it.

In the metadata section we therefore define several properties that we make use in the implementation:

- Properties
   - Value
   We define a control property value that will hold the value that the user selected in the rating. Getter and setter function for this property will automatically be created and we can also bind it to a field of the data model in the XML view if we like.

- Aggregations

As described in the first paragraph, we need three internal controls to realize our rating functionality. We therefore create three “hidden aggregations” by setting the visibility attribute to hidden. This way, we can use the models that are set on the view also in the inner controls and SAPUI5 will take care of the lifecycle management and destroy the controls when they are not needed anymore. Aggregations can also be used to hold arrays of controls but we just want a single control in each of the aggregations so we need to adjust the cardinality by setting the attribute multiple to false.

- _rating: A sap.m.RatingIndicator control for user input
- _label: A sap.m.Label to display additional information
- _button: A sap.m.Button to submit the rating

**Note**
You can define aggregations and associations

- An **aggregation** is a strong relation that also manages the lifecycle of the related control, for example, when the parent is destroyed, the related control is also destroyed. Also, a control can only be assigned to one single aggregation, if it is assigned to a second aggregation, it is removed from the previous aggregation automatically.

- An **association** is a weak relation that does not manage the lifecycle and can be defined multiple times. To have a clear distinction, an association only stores the ID, whereas an aggregation stores the direct reference to the control. We do not specify associations in this example, as we want to have our internal controls managed by the parent.

- Events
   - Change

   We specify a change event that the control will fire when the rating is submitted. It contains the current value as an event parameter. Applications can register to this event and process the result similar to “regular” SAPUI5 controls, which are in fact built similar to custom controls.

In the init function that is called by SAPUI5 automatically whenever a new instance of the control is instantiated, we set up our internal controls. We instantiate the three controls and store them in the internal aggregation by calling the framework method setAggregation that has been inherited from sap.ui.core.Control. We pass on the name of the internal aggregations that we specified above and the new control instances. We specify some control properties to make our custom control look nicer and register a liveChange event to the rating and a press event to the button. The initial texts for the label and the button are referenced from our i18n model.

Let’s ignore the other internal helper functions and event handlers for now and define our renderer. By using the APIs of the RenderManager and the control instance that are passed as references, we can describe the necessary HTML for our control. To open a new HTML tag we use the openStart method and pass "div" as the HTML element to be created. We also pass our control instance (ProductRating) to be associated with the HTML tag. The RenderManager will automatically generate the properties for the control and assign it to the div tag. After calling openStart, we can chain additional methods to set attributes or styles for the element. To set myAppDemoWTProductRating as our custom CSS class for the div element, we use the class method. Finally, we close the surrounding div tag by calling openEnd.

Next, we render the three child controls we defined in the aggregation of our ProductRating control. We retrieve the child controls using the getAggregation method with the aggregation name as parameter. The renderControl method is then called on each child control to render them. Finally, we close the element by calling the close method on the RenderManager and passing the "div" element name as argument. This completes the rendering of the custom control.

The setValue is an overridden setter. SAPUI5 will generate a setter that updates the property value when called in a controller or defined in the XML view, but we also need to update the internal rating control in the hidden aggregation to reflect the state properly. Also, we can skip the rerendering of SAPUI5 that is usually triggered when a property is changed on a control by calling the setProperty method to update the control property with true as the third parameter.

Now we define the event handler for the internal rating control. It is called every time the user changes the rating. The current value of the rating control can be read from the event parameter value of the sap.m.RatingIndicator control. With the value we call the setProperty method to update the control state, then we update the label next to the rating to show the user which value he has selected currently and also displays the maximum value. The string with the placeholder values is read from the i18n model that is assigned to the control automatically.

Next, we have the press handler for the rating button that submits our rating. We assume that rating a product is a one-time action and first disable the rating and the button so that the user is not allowed to submit another rating. We also update the label to show a "Thank you for your rating!" message, then we fire the change event of the control and pass in the current value as a parameter so that applications that are listening to this event can react on the rating interaction.

We define the reset method to be able to revert the state of the control on the UI to its initial state so that the user can again submit a rating.

`webapp/view/Detail.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.Detail"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:wt="ui5.walkthrough.control">
	<Page
		title="{i18n>detailPageTitle}"
		showNavButton="true"
		navButtonPress=".onNavBack">
		<ObjectHeader
			intro="{invoice>ShipperName}"
			title="{invoice>ProductName}"/>
		<wt:ProductRating 
			id="rating" 
			class="sapUiSmallMarginBeginEnd" 
			change=".onRatingChange"/>
	</Page>
</mvc:View>
```
- A new namespace **wt** is defined on the detail view so that we can reference our custom controls easily in the view. 
- We then add an instance of the ProductRating control to our detail page and register an event handler for the change event. To have a proper layout, we also add a margin style class.

`webapp/controller/Detail.controller.js`
```js
sap.ui.define([
	...
	"sap/m/MessageToast"
], (Controller, History, MessageToast) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.Detail", {
		…
		onObjectMatched(oEvent) {
			this.byId("rating").reset();
			...
		},

		onNavBack() {
			...
		},

		onRatingChange(oEvent) {
			const fValue = oEvent.getParameter("value");
			const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
		}
	});
});
```

- In the Detail controller we load the dependency to the `sap.m.MessageToast` because we will simply display a message instead of sending the rating to the backend to keep the example simple. The event handler **onRatingChange** reads the value of our custom change event that is fired when the rating has been submitted. We then display a confirmation message with the value in a MessageToast control.

In the **onObjectMatched** method, we call the reset method to make it possible to submit another rating as soon as the detail view is displayed for a different item.

`webapp/css/style.css`
```css
html[dir="ltr"] .myAppDemoWT .myCustomButton.sapMBtn {
    margin-right: 0.125rem
}
html[dir="rtl"] .myAppDemoWT .myCustomButton.sapMBtn {
    margin-left: 0.125rem
}
.myAppDemoWT .myCustomText {
    display: inline-block;
    font-weight: bold;
}
/*  ProductRating */
.myAppDemoWTProductRating {
    padding: 0.75rem;
}
.myAppDemoWTProductRating .sapMRI {
    vertical-align: initial;
}
```
- To layout our control, we add a little padding to the root class to have some space around the three inner controls, and we override the alignment of the RatingIndicator control so that it is aligned in one line with the label and the button.

We could also do this with more HTML in the renderer but this is the simplest way and it will only be applied inside our custom control. However, please be aware that the custom control is in your app and might have to be adjusted when the inner controls change in future versions of SAPUI5.

`webapp/i18n/i18n.properties`
```
…
# Detail Page
detailPageTitle=Walkthrough - Details
ratingConfirmation=You have rated this product with {0} stars

# Product Rating
productRatingLabelInitial=Please rate this product
productRatingLabelIndicator=Your rating: {0} out of {1}
productRatingLabelFinal=Thank you for your rating!
productRatingButton=Rate
The resource bundle is extended with the confirmation message and the strings that we reference inside the custom control. We can now rate a product on the detail page with our brand new control.
```

#### Conventions
- Put custom controls in the control folder of your app.

## Step 34: Responsiveness

In this step, we improve the responsiveness of our app. SAPUI5 applications can be run on phone, tablet, and desktop devices and we can configure the application to make best use of the screen estate for each scenario. Fortunately, SAPUI5 controls like the sap.m.Table already deliver a lot of features that we can use.

`webapp/view/InvoiceList.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.InvoiceList"
	xmlns="sap.m"
	xmlns:core="sap.ui.core"
	xmlns:mvc="sap.ui.core.mvc">
	<Table
		id="invoiceList"
		class="sapUiResponsiveMargin"
		width="auto"
		items="{
				path : 'invoice>/Invoices',
				sorter : {
					path : 'ShipperName',
					group : true
				}
			}">
		<headerToolbar>
			<Toolbar>
				<Title text="{i18n>invoiceListTitle}" />
				<ToolbarSpacer />
				<SearchField
					width="50%"
					search=".onFilterInvoices"/>
			</Toolbar>
		</headerToolbar>
		<columns>
			<Column
				hAlign="End"
				minScreenWidth="Small"
				demandPopin="true"
				width="5em">
				<Text text="{i18n>columnQuantity}" />
			</Column>
			<Column>
				<Text text="{i18n>columnName}" />
			</Column>
			<Column
				minScreenWidth="Small"
				demandPopin="true">
				<Text text="{i18n>columnStatus}" />
			</Column>
			<Column
				minScreenWidth="Tablet"
				demandPopin="false">
				<Text text="{i18n>columnSupplier}" />
			</Column>
			<Column hAlign="End">
				<Text text="{i18n>columnPrice}" />
			</Column>
		</columns>
		<items>
			<ColumnListItem
				type="Navigation"
				press=".onPress">
				<cells>
					<ObjectNumber
						number="{invoice>Quantity}"
						emphasized="false"/>
					<ObjectIdentifier title="{invoice>ProductName}" />
					<Text
						core:require="{
								Formatter: 'ui5/walkthrough/model/formatter'
						}"
						text="{
								parts: [
									'invoice>Status',
									'i18n>invoiceStatusA',
									'i18n>invoiceStatusB',
									'i18n>invoiceStatusC'
								],
								formatter: 'Formatter.statusText.bind($controller)'
						}"/>
					<Text text="{invoice>ShipperName}" />
					<ObjectNumber
						number="{
								parts: [
									'invoice>ExtendedPrice',
									'view>/currency'
								],
								type: 'sap.ui.model.type.Currency',
								formatOptions: {
									showMeasure: false
								}
							}"
						unit="{view>/currency}"
						state="{= ${invoice>ExtendedPrice} > 50 ? 'Error' : 'Success' }"/>
				</cells>
			</ColumnListItem>
		</items>
	</Table>
</mvc:View>
```

- We exchange the list with a table simply by replacing the tag <List> with <Table>. The table has a built-in responsiveness feature that allows us to make the app more flexible. The table and the list share the same set of properties so we can simply reuse these and also the sorter.

Since a table has multiple cells in each row, we have to define columns for our table and name these according to the data. We add five *sap.m.Column* controls to the column aggregation and configure each one a bit differently:

**Quantity**
- This column will contain a short number, so we set the alignment to End (which means "right" in LTR languages) and the width to 4em which is long enough for the column description. 
- As a description text we use a sap.m.Text control that references a property of the resource bundle. We set the property minScreenWidth to Small to indicate that this column is not so important on phones. We will tell the table to display this column below the main column by setting the property **demandPopin** to true.

**Name**
- Our main column that has a pretty large width to show all the details. It will always be displayed.

**Status**
- The status is not so important, so we also display it below the name field on small screens by setting minScreenWidth to small and demandPopin to true

**Supplier**
- We completely hide the Supplier column on phone devices by setting minScreenWidth to Tablet and demandPopin to false.

**Price**
- This column is always visible as it contains our invoice price.

Instead of the ObjectListItem that we had before, we will now split the information onto the cells that match the columns defined above. Therefore we change it to a ColumnListItem control with the same attributes, but now with cells aggregation. Here we create five controls to display our data:

**Quantity**
- A simple sap.m.ObjectNumber control that is bound to our data field.

**Name**
- A sap.m.ObjectIdentifier control that specifies the name.

**Status**
- A sap.m.Text control with the same formatter as before.

**Supplier**
- A simple sap.m.Text control.

**Price:**
- An ObjectNumber control with the same formatter as the attributes number and numberUnit from the previous steps.

Now we have defined our table responsively and can see the results when we decrease the browsers screen size. The Supplier column is not shown on phone sizes and the two columns Quantity and Status will be shown below the name.

`webapp/i18n/i18n.properties`
```js
...
# Invoice List
invoiceListTitle=Invoices
invoiceStatusA=New
invoiceStatusB=In Progress
invoiceStatusC=Done
columnQuantity=Quantity
columnName=Name
columnSupplier=Supplier
columnStatus=Status
columnPrice=Price
```

We add the column names and the attribute titles to our i18n file.

We can see the results when we decrease the browser's screen size or open the app on a small device.

#### Conventions
Optimize your application for the different screen sizes of phone, tablet, and desktop devices.

## Step 35: Device Adaptation

We now configure the visibility and properties of controls based on the device that we run the application on. By making use of the sap.ui.Device API and defining a device model we will make the app look great on many devices.

`webapp/view/HelloPanel.view.xml`

- We add two new properties **expandable** and **expanded** to the HelloPanel. 
- The user can now close and open the panel to have more space for the table below on devices with small screens. The property expandable is bound to a model named device and the path /system/phone. So the panel can be expanded on phone devices only. The device model is filled with the sap.ui.Device API of SAPUI5 as we see further down. The expanded property controls the state of the panel and we use expression binding syntax to close it on phone devices and have the panel expanded on all other devices. The device API of SAPUI5 offers more functionality to detect various device-specific settings, please have a look at the [documentation](https://ui5.sap.com/#/api/sap.ui.Device) for more details.

**Note**
The sap.ui.Device API detects the device type (Phone, Tablet, Desktop) based on the user agent and many other properties of the device. Therefore simply reducing the screen size will not change the device type. To test this feature, you will have to enable device emulation in your browser or open it on a real device.

We can also hide single controls by device type when we set a CSS class like sapUiVisibleOnlyOnDesktop or sapUiHideOnDesktop . We only show the button that opens the dialog on desktop devices and hide it for other devices. For more options, see the documentation linked below.

`webapp/Component.js`

- In the app component we add a dependency to **sap.ui.Device** and initialize the device model in the init method. We can simply pass the loaded dependency Device to the constructor function of the JSONModel. This will make most properties of the SAPUI5 device API available as a JSON model. The model is then set on the component as a named model so that we can reference it in data binding as we have seen in the view above.

**Note**
We have to set the binding mode to OneWay as the device model is read-only and we want to avoid changing the model accidentally when we bind properties of a control to it. By default, models in SAPUI5 are bidirectional (TwoWay). When the property changes, the bound model value is updated as well.

`webapp/view/Detail.view.xml`
**Tip**
You can test the device specific features of your app with the developer tools of your browser. For example in Google Chrome, you can emulate a tablet or a phone easily and see the effects. Some responsive options of SAPUI5 are only set initially when loading the app, so you might have to reload your page to see the results.

Some controls already have built-in responsive features that can be configured. The ObjectHeader control can be put in a more flexible mode by setting the attribute responsive to true and fullScreenOptimized to true as well. This will show the data that we add to the view now at different positions on the screen based on the device size.

We add the number and numberUnit field from the list of the previous steps also to the ObjectHeader and use the same formatter with the currency type as in the previous steps. We then define two attributes: The quantity of the invoice and the shipped date which is part of the data model. We have not used this shippedDate field from the invoices JSON file so far, it contains a date in typical string format.

We now use the Date type and provide the pattern of our date format in the source section of the format options. It will display a more human-readable formatted date text that also fits to small screen devices.

`webapp/controller/Detail.controller.js`
```js
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (Controller, History, MessageToast, JSONModel) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.Detail", {
		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");

			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
		},
		…
	});
});
```

In the Detail controller we simply add the view model with our currency definition to display the number properly. It is the same code as in the InvoiceList controller file.

`webapp/i18n/i18n.properties`
```
# Detail Page
detailPageTitle=Walkthrough - Details
ratingConfirmation=You have rated this product with {0} stars
dateTitle=Order date
quantityTitle=Quantity
```

We add the column names and the attribute titles to our i18n file.

We can see the results when we decrease the browser's screen size or open the app on a small device.

#### Conventions
Optimize your application for the different screen sizes of phone, tablet, and desktop devices.

## Step 36: Content Density

In this step of our Walkthrough tutorial, we adjust the content density based on the user’s device. SAPUI5 contains different content densities allowing you to display larger controls for touch-enabled devices and a smaller, more compact design for devices that are operated by mouse. In our app, we will detect the device and adjust the density accordingly.

`webapp/Component.js`
```js
...
		getContentDensityClass() {
			return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
		}
	});
});
```
To prepare the content density feature we will also add a helper method getContentDensityClass. SAPUI5 controls can be displayed in multiple sizes, for example in a compact size that is optimized for desktop and non-touch devices, and in a cozy mode that is optimized for touch interaction. The controls look for a specific CSS class in the HTML structure of the application to adjust their size.

This helper method queries the Device API directly for touch support of the client and returns the CSS class sapUiSizeCompact if touch interaction is not supported and sapUiSizeCozy for all other cases. We will use it throughout the application coding to set the proper content density CSS class.

`webapp/controller/App.controller.js`
```js
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], (Controller) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.App", {

		onInit() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});
```

We add an onInit method to the app controller that is called when the app view is instantiated. There, we query the helper function that we defined on the app component in order to set the corresponding style class on the app view. All controls inside the app view will now automatically adjust to either the compact or the cozy size, as defined by the style.

`webapp/manifest.json`
```json
...
  "sap.ui5": {
    ...  
    },
    "contentDensities": {
      "compact": true,
      "cozy": true
    }
    ...
  }
```
In the contentDensities section of the sap.ui5 namespace, we have to specify the modes that the application supports. Containers like the SAP Fiori launchpad allow switching the content density based on these settings.

As we have just enabled the app to run in both modes depending on the devices capabilities, we can set both to true in the application descriptor.

## Step 37: Accessibility

In this step we're going to improve the accessibility of our app.

To achieve this, we will add ARIA attributes. ARIA attributes are used by screen readers to recognize the application structure and to interpret UI elements properly. That way, we can make our app more accessible for users who are limited in their use of computers, for example visually impaired persons. The main goal here is to make our app usable for as many people as we can.

**Tip**
ARIA is short for Accessible Rich Internet Applications. It is a set of attributes that enable us to make apps more accessible by assigning semantic characteristics to certain elements. For more information, see [Accessible Rich Internet Applications (ARIA) – Part 1: Introduction](http://help.sap.com/disclaimer?site=https://blogs.sap.com/2015/06/01/accessible-rich-internet-applications-aria-part-1-introduction/)

One part of the ARIA attribute set are the so-called landmarks. You can compare landmarks to maps in that they help the user navigate through an app. For this step, we will use Google Chrome with a free landmark navigation extensionInformation published on non SAP site We will now add meaningful landmarks to our code.

`webapp/view/Overview.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.App"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	displayBlock="true">
	<Page title="{i18n>homePageTitle}">
		<landmarkInfo>
			<PageAccessibleLandmarkInfo
				rootRole="Region"
				rootLabel="{i18n>Overview_rootLabel}"
				contentRole="Main"
				contentLabel="{i18n>Overview_contentLabel}"
				headerRole="Banner"
				headerLabel="{i18n>Overview_headerLabel}"/>
		</landmarkInfo>
		<content>
			<mvc:XMLView viewName="ui5.walkthrough.view.HelloPanel"/>
			<mvc:XMLView viewName="ui5.walkthrough.view.InvoiceList"/>
		</content>
	</Page>
</mvc:View>
```

We use sap.m.PageAccessibleLandmarkInfo to define ARIA roles and labels for the overview page areas. For more information, see the API Reference: sap.m.PageAccessibleLandmarkInfo.

`webapp/view/InvoiceList.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.InvoiceList"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Panel accessibleRole="Region">
		<headerToolbar>
			<Toolbar>
				<Title text="{i18n>invoiceListTitle}"/>
				<ToolbarSpacer/>
				<SearchField
					width="50%"
					search=".onFilterInvoices"/>
			</Toolbar>
		</headerToolbar>
		<Table
			id="invoiceList"
			class="sapUiResponsiveMargin"
			width="auto"
			items="{
				path : 'invoice>/Invoices',
				sorter : {
					path : 'ShipperName',
					group : true
				}
			}">
			<columns>
				<Column
					hAlign="End"
					...
			</columns>
			...
		</Table>
	</Panel>
</mvc:View>
```

We add an sap.m.Panel around the invoice list and move the toolbar from the table into the panel, so that the region can take the title of the toolbar as its own. This has the effect that it will now be a region in our landmarks.

`webapp/view/HelloPanel.view.xml`
```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.HelloPanel"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Panel
		headerText="{i18n>helloPanelTitle}"
		class="sapUiResponsiveMargin"
		width="auto"
		expandable="{device>/system/phone}"
		expanded="{= !${device>/system/phone} }"
		accessibleRole="Region">	
		…
	</Panel>
</mvc:View>
```
In this view, we already have a panel, so we just add the accessibleRole attribute.
`webapp/i18n/i18n.properties`

```json
...
#Overview Page
Overview_rootLabel=Overview Page
Overview_headerLabel=Header
Overview_contentLabel=Page Content
ratingTitle=Rate the Product
...
```

Here, we add the text for the rating panel title and the labels for the ARIA regions to the text bundle.

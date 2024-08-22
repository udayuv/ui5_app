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




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment variables

You'll need to set your environment variables before using this project.

`FFL_STORE_ENDPOINT` = FFL backend endpoint to get the store config
`FFL_IFRAME_URL` = React iframe URL

## Available Scripts

Generate the config.js, which contains the environment variables used in bigcommerce.js. Remember to set the environment variables first.

### `npm run generate-config`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build` or `npm run build:dev`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Use the `build:dev` variant when working on your local environment.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Setting up Bigcommerce

Add the following scripts to the Script Manager of the store you want to setup. This script will make sure the config.js
file is loaded with the environment variables before loading the enhanced checkout.

```
<script>
    /** Hide all checkout steps. They will be displayed automatically when no FFL is needed or after it has been selected. **/
    const css = `.checkout-step--shipping, .checkout-step--billing, .checkout-step--payment {
        display: none;
    }`;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    
    // Get Storefront Configuration data
    window.FFLStorefrontApiToken = '{{settings.storefront_api.token}}';
    window.FFLCheckoutId = '{{checkout.id}}';
    
    const fflAppUrl = ''; // URL to the directory /public/js/ 
    const configScript = document.createElement('script');
    configScript.src = fflAppUrl + '/config.js';
    configScript.type = 'text/javascript';

    configScript.onload = function () {
        const bigCommerceScript = document.createElement('script');
        bigCommerceScript.src = fflAppUrl + '/bigcommerce.js';
        bigCommerceScript.type = 'text/javascript';
        document.head.appendChild(bigCommerceScript);
    };

    document.head.appendChild(configScript);
</script>
```

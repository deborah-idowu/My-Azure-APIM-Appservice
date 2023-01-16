# azure-apim-appservice-functions

---

| Page Type | Languages                                                | Key Services                                                     | Tools          |
| --------- | -------------------------------------------------------- | ---------------------------------------------------------------- | -------------- |
| Sample    | .NET <br> JavaScript (Node.js, React.js) <br> PowerShell | Azure API Management <br> Azure Functions <br> Azure App Service | GitHub Actions |

---

# Abstracting Azure App Service and Function Apps Web APIs with Azure API Management

This sample codebase demonstrates how to deploy APIs written in .NET to [Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/overview) and [Azure Function Apps](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), and abstract them behind an [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-key-concepts) gateway. A [React.js](https://reactjs.org/) web application is used to demonstrate calling the APIs.
<br>
The motivation behind this guide is to provide a basic structure to get up and running quickly with API Management in Azure.
<br>
This sample references existing approaches documented by Microsoft, namely:

-   [Azure API Management landing zone accelerator](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/integration/app-gateway-internal-api-management-function)
-   [Basic enterprise integration on Azure](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/enterprise-integration/basic-enterprise-integration?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json)

Azure API Management is a solution that enables abstraction, security, observability, discovery, and consumption of API assets in an Azure-first, hybrid, or multicloud environment.
<br>
The solution presented in this codebase is simple and should be viewed as a foundation for modification and expansion into more complex applications.

## Prerequisites

-   [An Azure Subscription](https://azure.microsoft.com/en-us/free/) - for hosting cloud infrastructure
-   [Az CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) - for deploying Azure infrastructure as code
-   [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Ccsharp%2Cportal%2Cbash) and [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio) - for testing Functions locally
-   [.NET 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) - for .NET development
-   [Node.js](https://nodejs.org/en/download/) - for Node.js development
-   (Optional) [A GitHub Account](https://github.com/join) - for deploying code via GitHub Actions

## Running this sample

### _*Setting Up the Cloud Infrastructure*_

#### App Registration

-   [Register a new application](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
-   [Create a new client secret](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret) - you will use this if you choose to automate the deployment of the application using GitHub Actions

#### Function App

-   Add the desired resource names in `devops/config/variables.json`.
-   Run the script `devops/scripts/integration/function.ps1`.
-   This will create the Function App instance, in addition to all of the related components including a [Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview), [App Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?tabs=net), and an [App Service Plan](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans).

#### Web API & API Management

-   Add the desired resource names in `devops/config/variables.json`.
-   Run the script `devops/scripts/api/api.ps1`.
-   This will create an API Management and App Service instance, in addition to an [App Service Plan](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) if not already created.

#### Client Web Application

-   Add the desired resource names in `devops/config/variables.json`.
-   Run the script `devops/scripts/client/client.ps1`.
-   This will create an App Service instance, in addition to an [App Service Plan](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) if not already created.

#### GitHub Actions Secrets (for automated deployments)

-   To deploy to Azure using GitHub Actions, a handful of credentials are required for connection and configuration. In this example, they will be set as [Actions Secrets](https://docs.github.com/en/rest/actions/secrets?apiVersion=2022-11-28). For each of the below secrets, the secret name and steps on how to populate the secret is provided.

1.  `AZURE_SP_CREDENTIALS`:

    -   A JSON object that looks like the following will need to be populated with 4 values:

    ```
    {
       "clientId": "<GUID>",
       "clientSecret": "<STRING>",
       "subscriptionId": "<GUID>",
       "tenantId": "<GUID>"
    }
    ```

    -   You can find more details on creating this secret [here](https://github.com/marketplace/actions/azure-login#configure-a-service-principal-with-a-secret).
    -   For clientId, run: `az ad sp list --display-name <service principal name> --query '[].[appId][]' --out tsv`
    -   For tenantId, run: `az ad sp show --id <clientID> --query 'appOwnerOrganizationId' --out tsv`
    -   For subscriptionId, run: `az account show --query id --output tsv`
    -   For clientSecret: This is the client secret created alongside the App Registration above

### _*Deploying the Codebase*_

-   _Note: This section will discuss deployment of the codebase via GitHub Actions. If you choose not to deploy via GitHub Actions, you may opt to manually deploy the code by following the automated tasks or with another CI/CD tool - the steps will be the same._

1.  Deploy the Function App by updating the branch trigger in the `.github/workflows/function-cicd.yml` file to trigger the GitHub Action.

    -   This will publish, package, and deploy the .NET 'ApiFunction' to the above deployed Function App.

2.  Deploy the web API to App Service by updating the branch trigger in the `.github/workflows/web-api-cicd.yml ` file to trigger the GitHub Action.

    -   This will build, publish, and deploy a web API to the API App Service deployed above.

3.  Set up the APIs and Product:

    -   In the Azure Portal, navigate to the API Management resource, choose the 'APIs' blade, and scroll down to 'Create from Azure resource'. Follow these guides to import the resources you created as APIs (accept the defaults):

        -   [Import Azure Function App as an API](https://learn.microsoft.com/en-us/azure/api-management/import-function-app-as-api)
        -   [Import Azure App Service as an API](https://learn.microsoft.com/en-us/azure/api-management/import-app-service-as-api)
            -   You may need to add the App Service URL in the 'Web service URL' setting of the App Service API after importing it if you're seeing an HTTP 500 - Internal Server Error as described [here](https://stackoverflow.com/a/50866941/8333117).

    -   In the Azure Portal, navigate to the API Management resource, choose the 'Products' blade, and follow this guide to create a product:

        -   [Create and publish a product](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-add-products?tabs=azure-portal)
            -   When creating the product, add the APIs that you just created.

    -   To test the React app locally, you may consider adding a [CORS policy](https://learn.microsoft.com/en-us/azure/api-management/api-management-policies#cross-domain-policies) for the APIs you created. A policy which allows all origins can be found at `devops/scripts/api/cors-policy.xml`.

4.  Deploy the web client to App Service by updating the branch trigger in the `.github/workflows/client-cicd.yml ` file to trigger the GitHub Action.

    -   This will build and deploy the React app to the web App Service deployed above.
    -   After deploying, you will need to configure the startup command.
        In the Azure Portal, open the App Service, and in the Configuration blade, choose the 'General settings' tab, and set the Startup Command as `pm2 serve /home/site/wwwroot --no-daemon`.
    -   _The deployment script assumes that the default values were accepted when importing the Function and App Service into API Management in the previous step. If any customizations were made, the 'Variable replacement' task in the GitHub Action will need to be modified._

## Architecture & Workflow

![Azure Function, App Service, and API Management](/docs/diagram.png)
_A diagram visually describing the flow of code from local development to GitHub to Azure, and the way the components communicate in Azure._

1. The Function's `/ApiFunction` endpoint returns a simple string, and the Web API exposes a `/Hello` endpoint, which also returns a simple string. The end user invokes these endpoints by calling their abstracted endpoint via API Management.
    - In the UI, the user is prompted to provide an API key. The return values of these endpoints are printed to the page once execution is complete.
    - To get a Subscription key, navigate to the API Management service in the Azure Portal and open the 'Subscriptions' blade. Choose either the Primary or Secondary key for the Product that you created above.
2. Although the client application was created as a demonstration of calling the APIs via JavaScript, you may use any utility to call the APIs, including the [built-in testing tool](https://learn.microsoft.com/en-us/azure/api-management/import-and-publish#test-the-new-api-in-the-azure-portal) in the Azure Portal.

## Considerations & Next Steps

_Since this codebase demonstrates a basic setup, several additional steps can be taken to configure the architecture for production. Some of the main considerations are listed below._

-   Restrict traffic to only be routed through APIM
    -   As set up in this tutorial, the backend services communicate with API Management, but are still available on the internet. In a production scenario, you should restrict access to the backends so that traffic is only routed via the API Management instance. There are a variety of ways to achieve this, some of them being:
        -   [IP-based rules](https://learn.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions?tabs=azurecli#set-an-ip-address-based-rule)
        -   [Client Certificate Authentication](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-mutual-certificates)
        -   [Network-level security](https://github.com/mspnp/vnet-integrated-serverless-microservices/blob/main/docs/security_pattern.md)
-   Import additional APIs
    -   APIs can be imported from a variety of backend types, including Azure Kubernetes Service, Logic Apps, or as one-off HTTP endpoints.
    -   OpenAPI 3 APIs can be easily imported as described [here](https://devblogs.microsoft.com/premier-developer/importing-an-openapi-api-into-azure-api-management-service/).
-   Authentication and authorization
    -   API Management has various [authentication and authorization](https://learn.microsoft.com/en-us/azure/api-management/authentication-authorization-overview) mechanisms available to secure user access to features and APIs.
    -   You can integrate API Management with Azure Active Directory via [OAuth](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-protect-backend-with-aad) or [AD B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/secure-api-management?tabs=app-reg-ga).
-   Create API revisions and versions
    -   [Revisions](https://learn.microsoft.com/en-us/azure/api-management/api-management-revisions) allow you to modify your API endpoints in a safe/non-breaking way.
    -   Consumers of an API will be able to choose which [version](https://learn.microsoft.com/en-us/azure/api-management/api-management-versions) of your API to use.
-   Create policies
    -   You may add [policies](https://learn.microsoft.com/en-us/azure/api-management/set-edit-policies?tabs=form) to inbound and outbound requests to control things like rate limiting, transforming headers, caching, validating JWT tokens, etc.
-   Scaling up
    -   The Consumption and Developer tiers may be appropriate for prototyping and evaluating the service, whereas the Standard and Premium tiers are intended for production usage, with more features to handle larger workloads. By default, this example uses the Developer tier.
    -   See more about the available tiers and features [here](https://learn.microsoft.com/en-us/azure/api-management/api-management-features).

## Potential Use Cases

-   There are several practical use cases for using Azure API Management, some of which include:
    -   Using an API gateway to secure and manage access to backend services.
    -   Having an API developer portal to easily onboard developers and publish API documentation.
    -   Enforcing usage quotas and rate limits to ensure that only authorized users have access to the API.
    -   Transforming incoming and outgoing data for better compatibility with other services.
    -   Leveraging out-of-the-box policies for authentication, authorization, and rate limiting.

## Additional Resources

-   [Build a .NET web app using GitHub Actions](https://learn.microsoft.com/en-us/dotnet/architecture/devops-for-aspnet-developers/actions-build)
-   [Deploy to App Service using GitHub Actions](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=applevel)
-   [React Deployment on App Service Linux](https://azureossd.github.io/2022/02/07/React-Deployment-on-App-Service-Linux/)
-   [Deploying C# Azure Functions via GitHub Actions - _blog_](https://www.willvelida.com/posts/deploying-csharp-azure-functions-via-github-actions/)

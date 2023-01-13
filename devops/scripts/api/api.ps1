param(
    [Parameter()]
    [String]$paramDbSec  # from secret var on cli
)

# provide resource names here
# Note: bicep is idempotent
# run from parent folder (one up from devops folder)
$origPath = Get-Location
$origPath = $origPath.Path
Set-Location $PSScriptRoot

$config = Get-Content "../../config/variables.json" | ConvertFrom-Json
$envConfig = $config.$($config.env)

# global vars
$rgName = $envConfig.resourceGroup
$location = $envConfig.location

# mysql vars
$serverName = $envConfig.dbServerName
$administratorLogin = $envConfig.dbServerName 

# spring app vars
# $springCloudInstanceName = $envConfig.springCloudInstanceName
# $logAnalyticsWorkspaceName = $envConfig.logAnalyticsWorkspaceName
# $springCloudAppSubnetId = $envConfig.springCloudAppSubnet
# $springCloudRuntimeSubnetId = $envConfig.springCloudRuntimeSubnet
# $applicationVnet = $envConfig.applicationVnet

$appServicePlan = $envConfig.appServicePlan
$appServiceName = $envConfig.appServiceName

# APIM vars
$apiManagementServiceName = $envConfig.apiManagementServiceName
$apiManagementOrg = $envConfig.apiManagementOrg
$apiManagementAdminEmail = $envConfig.apiManagementAdminEmail

Write-Host "Set config"
Write-Host "Creating RG..."

# RG deploy
az group create --name $rgName --location $location

Write-Host "Created RG"
Write-Host "Creating MySQL DB..."

# resource-specific actions
# MySQL ###
# az deployment group create --resource-group $rgName --template-file '../../bicep/api/db.bicep' --parameters serverName=$serverName administratorLogin=$administratorLogin administratorLoginPassword=$paramDbSec

###############

Write-Host "Created MySQL DB"

# App service ###
# az appservice plan create --resource-group $rgName --name $appServicePlan --sku "B1" --location $location --is-linux
# az webapp create --resource-group $rgName --plan $appServicePlan --name $appServiceName --runtime "JAVA:17-java17"

###############

# APIM ###
Write-Host "Creating APIM..."

az deployment group create --resource-group $rgName --template-file '../../bicep/api/apim.bicep' --parameters apiManagementServiceName=$apiManagementServiceName publisherEmail=$apiManagementAdminEmail publisherName=$apiManagementOrg

Write-Host "Created APIM"
###############

# get publish profile - this can be done either in-pipeline and passed into YML, or it can be pre-stored as a GH secret. Pre-storing as a secret is how its done in docs/simplest
# https://learn.microsoft.com/en-us/azure/app-service/app-service-sql-asp-github-actions#create-a-publish-profile-secret
# https://gist.github.com/Oyeyinka/3897cc31b44dde64589858be7e55f4b4
# $appSvcResId = $(az webapp show --resource-group $rgName --name $appServiceName --query "id" -o tsv)
# az webapp deployment list-publishing-profiles --ids $appSvcResId --xml

# Spring app ###
# get resource ID of existing log analytics workspace (created by ui) TODO refactor into "common" infra
# $laResourceId = $(az monitor log-analytics workspace show --resource-group $rgName --workspace-name $logAnalyticsWorkspaceName --query "id" -o tsv)

# set up vnet + subnets
# https://learn.microsoft.com/en-us/azure/spring-apps/how-to-deploy-in-azure-virtual-network?tabs=azure-portal#grant-service-permission-to-the-virtual-network
# az network vnet create --resource-group $rgName --name $applicationVnet --location $location --address-prefix "10.1.0.0/16" #  "10.0.0.0/14"

# az network vnet subnet create --resource-group $rgName --vnet-name $applicationVnet --address-prefixes "10.1.0.0/24" --name $springCloudRuntimeSubnetId 
# az network vnet subnet create --resource-group $rgName --vnet-name $applicationVnet --address-prefixes "10.1.1.0/24" --name $springCloudAppSubnetId 

# grant service permission to vnet
# $vnetResourceId=$(az network vnet show --name $applicationVnet --resource-group $rgName --query "id" --output tsv)
# az role assignment create --role "Owner" --scope $vnetResourceId --assignee "e8de9221-a19c-4c81-b814-fd37c6caf9d2"

# get resource IDs for subnets
# $springCloudRuntimeSubnetResourceId = $(az network vnet subnet show --resource-group $rgName --name $springCloudRuntimeSubnetId --vnet-name $applicationVnet --query "id" -o tsv)

# $springCloudAppSubnetResourceId = $(az network vnet subnet show --resource-group $rgName --name $springCloudAppSubnetId --vnet-name $applicationVnet --query "id" -o tsv)

# set up spring app
#  limitation - cannot deploy to Basic using IaC
# az spring create --resource-group $rgName --name $springCloudInstanceName --vnet $applicationVnet --service-runtime-subnet $springCloudRuntimeSubnetId --app-subnet $springCloudAppSubnetId  --enable-java-agent --sku "Standard" --location $location

# https://learn.microsoft.com/en-us/azure/spring-apps/quickstart-deploy-infrastructure-vnet-bicep?tabs=azure-spring-apps-standard
# az deployment group create --resource-group $rgName --template-file '../../bicep/api/springcloud.bicep' --parameters springCloudInstanceName=$springCloudInstanceName laWorkspaceResourceId=$laResourceId springCloudAppSubnetID=$springCloudAppSubnetResourceId springCloudRuntimeSubnetID=$springCloudRuntimeSubnetResourceId

###############

Write-Host "Created application"

# reset wd
Set-Location $origPath
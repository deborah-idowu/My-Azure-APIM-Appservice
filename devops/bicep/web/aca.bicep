// ACA
param location string = resourceGroup().location
param acrName string
param containerAppName string
param useExternalIngress bool
param containerPort int
param acaIdentityId string
param caEnvName string
param containerImage string
param logAnalyticsWsName string
param tag string

// from https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles
// var acrPullGuid = '7f951dda-4ed3-4680-a7ca-43fe172d538d'

var imageConcat = '${acrName}.azurecr.io/${containerImage}:${tag}'

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: logAnalyticsWsName
  location: location
  properties: {
    retentionInDays: 30
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: caEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// resource acaIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
//   name: acaIdentityName
//   location: location
// }

// resource role_assignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
//   name: guid(subscription().id, acrPullGuid)
//   properties: {
//     principalId: acaIdentity.properties.principalId
//     roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', acrPullGuid) //AcrPull
//   }
// }

resource containerApp 'Microsoft.App/containerApps@2022-03-01' = {
  name: containerAppName
  location: location
  identity: {
    type: 'SystemAssigned,UserAssigned'
    userAssignedIdentities: {
      '${acaIdentityId}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      activeRevisionsMode: 'Multiple'
      //secrets: [
      //  {
      //    name: 'servicebusconnectionstring'
      //    value: sbaccess.listKeys().primaryConnectionString
      //  }
      //]

      registries: [
        {
          server: '${acrName}.azurecr.io'
          //username: acrName
          //passwordSecretRef: 'acrtokenpwd'
          identity: acaIdentityId
        }
      ]
      ingress: {
        external: useExternalIngress
        targetPort: containerPort
      }
    }
    template: {
      containers: [
        {
          image: imageConcat
          name: containerImage
          //env: [
          //  {
          //    name: 'serviceBusQueueName'
          //    value: serviceBusQueueName
          //  }
          //  {
          //    name: 'ConnectionString'
          //    secretRef: 'servicebusconnectionstring'
          //  }
          //]
          command: [
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
        //rules: [
        //  {
        //    name: 'queue-based-autoscaling'
        //    custom: {
        //      type: 'azure-servicebus'
        //      metadata: {
        //        queueName: serviceBusQueueName
        //        messageCount: '20'
        //      }
        //      auth: [ {
        //          secretRef: 'servicebusconnectionstring'
        //          triggerParameter: 'connection'
        //        } ]
        //    }
        //  } ]
      }
    }
  }
}

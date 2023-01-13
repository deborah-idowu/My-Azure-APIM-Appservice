// Creates service bus, topic, and subscription
param namespaces_svc_bus_name string
param topic_name string
param location string = resourceGroup().location

resource namespaces_svc_bus_name_resource 'Microsoft.ServiceBus/namespaces@2022-01-01-preview' = {
  name: namespaces_svc_bus_name
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    minimumTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
    zoneRedundant: false
  }
}

resource namespaces_svc_bus_name_RootManageSharedAccessKey 'Microsoft.ServiceBus/namespaces/AuthorizationRules@2022-01-01-preview' = {
  parent: namespaces_svc_bus_name_resource
  name: 'RootManageSharedAccessKey'
  // location: location
  properties: {
    rights: [
      'Listen'
      'Manage'
      'Send'
    ]
  }
}

resource namespaces_svc_bus_name_default 'Microsoft.ServiceBus/namespaces/networkRuleSets@2022-01-01-preview' = {
  parent: namespaces_svc_bus_name_resource
  name: 'default'
  // location: location
  properties: {
    publicNetworkAccess: 'Enabled'
    defaultAction: 'Allow'
    virtualNetworkRules: []
    ipRules: []
  }
}

resource namespaces_svc_bus_name_topic 'Microsoft.ServiceBus/namespaces/topics@2022-01-01-preview' = {
  parent: namespaces_svc_bus_name_resource
  name: topic_name
  // location: location
  properties: {
    maxMessageSizeInKilobytes: 256
    defaultMessageTimeToLive: 'P14D'
    maxSizeInMegabytes: 1024
    requiresDuplicateDetection: false
    duplicateDetectionHistoryTimeWindow: 'PT10M'
    enableBatchedOperations: true
    status: 'Active'
    supportOrdering: true
    autoDeleteOnIdle: 'P10675199DT2H48M5.4775807S'
    enablePartitioning: false
    enableExpress: false
  }
}

resource namespaces_svc_bus_name_topic_sub1 'Microsoft.ServiceBus/namespaces/topics/subscriptions@2022-01-01-preview' = {
  parent: namespaces_svc_bus_name_topic
  name: 'sub1'
  // location: location
  properties: {
    isClientAffine: false
    lockDuration: 'PT30S'
    requiresSession: false
    defaultMessageTimeToLive: 'P14D'
    deadLetteringOnMessageExpiration: false
    deadLetteringOnFilterEvaluationExceptions: false
    maxDeliveryCount: 3
    status: 'Active'
    enableBatchedOperations: true
    autoDeleteOnIdle: 'P14D'
  }
  // dependsOn: [

  //   namespaces_svc_bus_name_resource
  // ]
}

resource namespaces_svc_bus_name_topic_sub1_Default 'Microsoft.ServiceBus/namespaces/topics/subscriptions/rules@2022-01-01-preview' = {
  parent: namespaces_svc_bus_name_topic_sub1
  name: '$Default'
  // location: location
  properties: {
    action: {
    }
    filterType: 'SqlFilter'
    sqlFilter: {
      sqlExpression: '1=1'
      compatibilityLevel: 20
    }
  }
  // dependsOn: [

  //   namespaces_svc_bus_name_topic
  //   namespaces_svc_bus_name_resource
  // ]
}

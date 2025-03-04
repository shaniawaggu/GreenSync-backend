provider "azurerm" {
  features {}
<<<<<<< HEAD
=======

>>>>>>> 57f9966f0a374bd82864634709ee299fd68eec84
}

resource "azurerm_resource_group" "aks_rg" {
  name     = "myAKSResourceGroup"
  location = "uksouth"
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "myAKSCluster"
  location            = azurerm_resource_group.aks_rg.location
  resource_group_name = azurerm_resource_group.aks_rg.name
  dns_prefix          = "myakscluster"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
}

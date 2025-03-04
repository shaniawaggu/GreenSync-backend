provider "azurerm" {
  features {}
  subscription_id = "ff8cc0ac-8ae4-49df-b42c-741ae642a6a5"
}

resource "azurerm_resource_group" "rg" {
  name     = "myResourceGroup"
  location = "uksouth"
}

resource "azurerm_container_group" "aci" {
  name                = "myContainerGroup"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  ip_address_type     = "Public"
  dns_name_label      = "greensyncid"  # must be globally unique

  container {
    name   = "mvc"
    image  = "htflynn/forecast-mvc:latest"
    cpu    = "0.5"
    memory = "1.5"
    ports {
      port     = 80
      protocol = "TCP"
    }
  }

  container {
    name   = "database"
    image  = "htflynn/forecast-db:latest"
    cpu    = "0.5"
    memory = "1.5"
    ports {
      port     = 3306
      protocol = "TCP"
    }
  }
}
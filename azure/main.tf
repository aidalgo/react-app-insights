terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Data source to reference existing Application Insights
data "azurerm_application_insights" "existing" {
  name                = var.application_insights_name
  resource_group_name = var.resource_group_name
}

# Application Insights Workbook
/* resource "azurerm_application_insights_workbook" "react_dashboard" {
  name                = uuidv5("dns", "${var.resource_group_name}-${var.application_insights_name}-workbook")
  display_name        = var.workbook_display_name
  location            = data.azurerm_application_insights.existing.location
  resource_group_name = var.resource_group_name
  category            = "workbook"
  source_id           = lower(data.azurerm_application_insights.existing.id)

  data_json = templatefile("${path.module}/workbook-template.json.tftpl", {
    dashboard_title       = var.dashboard_title
    dashboard_description = var.dashboard_description
    time_range_days       = var.time_range_days
    time_range_ms         = var.time_range_days * 24 * 60 * 60 * 1000
  })

  tags = var.tags
} */

# User Activity Workbook
resource "azurerm_application_insights_workbook" "user_activity" {
  name                = uuidv5("dns", "${var.resource_group_name}-${var.application_insights_name}-user-activity-workbook")
  display_name        = "${var.workbook_display_name} - User Activity"
  location            = data.azurerm_application_insights.existing.location
  resource_group_name = var.resource_group_name
  category            = "workbook"
  source_id           = lower(data.azurerm_application_insights.existing.id)

  data_json = templatefile("${path.module}/workbook-user-activity-template.json.tftpl", {
    subscription_id           = data.azurerm_application_insights.existing.id
    resource_group_name       = var.resource_group_name
    application_insights_name = var.application_insights_name
  })

  tags = var.tags
}

# Admin Dashboard Workbook
resource "azurerm_application_insights_workbook" "admin_dashboard" {
  name                = uuidv5("dns", "${var.resource_group_name}-${var.application_insights_name}-admin-dashboard-workbook")
  display_name        = "${var.workbook_display_name} - Admin Dashboard"
  location            = data.azurerm_application_insights.existing.location
  resource_group_name = var.resource_group_name
  category            = "workbook"
  source_id           = lower(data.azurerm_application_insights.existing.id)

  data_json = templatefile("${path.module}/workbook-admin-dashboard-template.json.tftpl", {
    subscription_id           = data.azurerm_application_insights.existing.id
    resource_group_name       = var.resource_group_name
    application_insights_name = var.application_insights_name
  })

  tags = var.tags
}

# Payment Dashboard Workbook
resource "azurerm_application_insights_workbook" "payment_dashboard" {
  name                = uuidv5("dns", "${var.resource_group_name}-${var.application_insights_name}-payment-dashboard-workbook")
  display_name        = "${var.workbook_display_name} - Payment Dashboard"
  location            = data.azurerm_application_insights.existing.location
  resource_group_name = var.resource_group_name
  category            = "workbook"
  source_id           = lower(data.azurerm_application_insights.existing.id)

  data_json = templatefile("${path.module}/workbook-payment-dashboard-template.json.tftpl", {
    subscription_id           = data.azurerm_application_insights.existing.id
    resource_group_name       = var.resource_group_name
    application_insights_name = var.application_insights_name
  })

  tags = var.tags
}

# Observability Dashboard Workbook
resource "azurerm_application_insights_workbook" "observability_dashboard" {
  name                = uuidv5("dns", "${var.resource_group_name}-${var.application_insights_name}-observability-dashboard-workbook")
  display_name        = "${var.workbook_display_name} - Observability Dashboard"
  location            = data.azurerm_application_insights.existing.location
  resource_group_name = var.resource_group_name
  category            = "workbook"
  source_id           = lower(data.azurerm_application_insights.existing.id)

  data_json = templatefile("${path.module}/workbook-observability-dashboard-template.json.tftpl", {
    subscription_id           = data.azurerm_application_insights.existing.id
    resource_group_name       = var.resource_group_name
    application_insights_name = var.application_insights_name
  })

  tags = var.tags
}

# Combined Dashboard Workbook
resource "azurerm_application_insights_workbook" "combined_dashboard" {
  name                = uuidv5("dns", "${var.resource_group_name}-${var.application_insights_name}-combined-dashboard-workbook")
  display_name        = "${var.workbook_display_name} - Combined Dashboard"
  location            = data.azurerm_application_insights.existing.location
  resource_group_name = var.resource_group_name
  category            = "workbook"
  source_id           = lower(data.azurerm_application_insights.existing.id)

  data_json = templatefile("${path.module}/workbook-combined-dashboard-template.json.tftpl", {
    subscription_id           = data.azurerm_application_insights.existing.id
    resource_group_name       = var.resource_group_name
    application_insights_name = var.application_insights_name
  })

  tags = var.tags
}

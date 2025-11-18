variable "zone_id" {
  description = "Cloudflare Zone ID for tkow.net domain"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
  sensitive   = true
}

variable "allowed_emails" {
  description = "List of email addresses allowed to access the stage environment"
  type        = list(string)
  default     = []
}

variable "application_name" {
  description = "Name for the Cloudflare Access application"
  type        = string
  default     = "Stage Environment Access"
}

variable "session_duration" {
  description = "Session duration for Access (e.g., '24h', '168h')"
  type        = string
  default     = "24h"
}

variable "stage_domain" {
  description = "Stage domain for the application"
  type        = string
  default     = "stage.tkow.net"
}

variable "stage_worker_domain" {
  description = "Stage worker domain for the application"
  type        = string
  default     = "tanstack-start-app-stage.auditmos.workers.dev"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token (recommended)"
  type        = string
  sensitive   = true
  default     = null
}
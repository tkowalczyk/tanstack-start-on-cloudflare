output "stage_domain_application_id" {
  description = "Cloudflare Access Application ID for stage.tkow.net"
  value       = cloudflare_zero_trust_access_application.stage_domain.id
}

output "stage_worker_application_id" {
  description = "Cloudflare Access Application ID for Workers.dev domain"
  value       = cloudflare_zero_trust_access_application.stage_worker.id
}

output "stage_domain_url" {
  description = "Access URL for stage.tkow.net"
  value       = "https://stage.tkow.net"
}

output "stage_worker_url" {
  description = "Access URL for Workers.dev domain"
  value       = "https://tanstack-start-app-stage.auditmos.workers.dev"
}


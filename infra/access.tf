resource "cloudflare_zero_trust_access_identity_provider" "email_otp" {
  account_id = var.account_id
  name       = "Email One-Time PIN"
  type       = "onetimepin"
  config = {}
}

resource "cloudflare_zero_trust_access_policy" "stage_domain_email" {
  account_id = var.account_id
  name       = "Email Allowlist Policy - Domain"
  decision   = "allow"

  include = [
    for email in var.allowed_emails : {
      email = {
        email = email
      }
    }
  ]
}

resource "cloudflare_zero_trust_access_application" "stage_domain" {
  account_id       = var.account_id
  name             = "${var.application_name} - Domain"
  domain           = "stage.tkow.net"
  type             = "self_hosted"
  session_duration = var.session_duration
  allowed_idps = [cloudflare_zero_trust_access_identity_provider.email_otp.id]
  policies = [{
    id = cloudflare_zero_trust_access_policy.stage_domain_email.id
  }]
}

resource "cloudflare_zero_trust_access_policy" "stage_worker_email" {
  account_id = var.account_id
  name       = "Email Allowlist Policy - Worker"
  decision   = "allow"

  include = [
    for email in var.allowed_emails : {
      email = {
        email = email
      }
    }
  ]
}

resource "cloudflare_zero_trust_access_application" "stage_worker" {
  account_id       = var.account_id
  name             = "${var.application_name} - Worker"
  domain           = "tanstack-start-app-stage.auditmos.workers.dev"
  type             = "self_hosted"
  session_duration = var.session_duration
  allowed_idps = [cloudflare_zero_trust_access_identity_provider.email_otp.id]
  policies = [{
    id = cloudflare_zero_trust_access_policy.stage_worker_email.id
  }]
}


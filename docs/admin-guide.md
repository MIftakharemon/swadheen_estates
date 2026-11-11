# Admin guide

## Sign in

Seed or invite a staff user, then use `/login`. Staff roles are checked server-side; hiding a menu item is not the authorization boundary. Super Admin and Manager accounts must have 2FA enabled before production access is allowed.

## Inventory

Use **Properties** to review listing status, type, price and last update. Select multiple rows for bulk publishing/archive actions. Public detail pages are generated from the property slug; changing a slug requires a redirect record before publishing in a production CMS adapter.

## Leads

Use **Leads** as the source of truth for enquiries. Move a lead only after the activity is recorded. Score is a prioritisation signal, not an automated eligibility decision. Assigned agents may see only their own leads unless their role grants wider access.

## Visits

The calendar is the shared view of availability. Confirm the customer, property, agent and timezone before saving a slot. Reminder delivery belongs in the notification queue, not in a blocking request.

## Media

The visual library groups images, panoramas, models, floor plans and documents. Production uploads must use signed, short-lived object-storage URLs; never proxy a customer file through the Next.js request process.

## Reporting

Export only the minimum fields needed for the report. Exports are audit events and must be stored in a private bucket with a short expiry in production.

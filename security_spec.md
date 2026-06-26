# Firebase Security Rules Specification (Namma Area Civic App)

This document outlines the security invariants, validation rules, and malicious payloads designed to test our Firestore security rules boundaries.

## 1. Data Invariants

1. **User Identity Protection**: A user's profile can only be written to by the authenticated user themselves. Role escalation (e.g., changing role to 'admin' or changing score maliciously) is blocked.
2. **Citizen Grievance Integrity (Complaints)**:
   - Creating complaints requires an active, verified login.
   - Upvotes must increment exactly by +1 or decrement by -1, locked to unique user IDs to prevent double-upvoting.
   - Comments can only be added to existing complaints, validating authorship.
3. **Lost & Found & Jobs Listings**:
   - Posting or updating is restricted to authenticated residents.
   - Immutable fields like `creatorId` and `createdAt` must be locked.
4. **Interactive Neighborhood Groups**:
   - Members can only publish posts inside groups they are active members of.
   - Standard size checks are enforced across all text areas and fields.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads attempt to bypass authorization, pollute integrity, or trigger unauthorized mutations.

### Payload 1: Privilege Escalation (User attempts to self-grant Admin role)
- **Path**: `/users/malicious_user`
- **Operation**: `create`
- **Malicious Payload**:
  ```json
  {
    "id": "malicious_user",
    "email": "attacker@gmail.com",
    "name": "Attacker",
    "role": "admin",
    "contributionsCount": 999999
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 2: Identity Spoofing (Creating a complaint on behalf of another user)
- **Path**: `/complaints/comp_spoof`
- **Operation**: `create`
- **Malicious Payload**:
  ```json
  {
    "id": "comp_spoof",
    "title": "Stray Dog Nuisance",
    "description": "Feral dogs near community garden.",
    "creatorId": "arjun_kumar",
    "creatorName": "Arjun Kumar",
    "status": "Pending"
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED` (auth.uid does not match creatorId)

### Payload 3: Value Poisoning (Inserting oversized 2MB string as description)
- **Path**: `/complaints/comp_poison`
- **Operation**: `create`
- **Malicious Payload**:
  ```json
  {
    "id": "comp_poison",
    "title": "Water Pipe Leak",
    "description": "[A massive string exceeding 50,000 characters ...]",
    "status": "Pending"
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 4: State Shortcutting (Setting complaint status to 'Resolved' directly upon creation)
- **Path**: `/complaints/comp_shortcut`
- **Operation**: `create`
- **Malicious Payload**:
  ```json
  {
    "id": "comp_shortcut",
    "title": "Garbage issue",
    "status": "Resolved"
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED` (Initial status must be 'Pending')

### Payload 5: Unauthorized Update (Modifying another citizen's reported complaint)
- **Path**: `/complaints/comp1`
- **Operation**: `update` (from non-creator user)
- **Malicious Payload**:
  ```json
  {
    "title": "Hacked Title",
    "description": "Defaced"
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 6: Upvote Spoofing (Directly manipulating the upvotes field to +500)
- **Path**: `/complaints/comp1`
- **Operation**: `update`
- **Malicious Payload**:
  ```json
  {
    "upvotes": 500
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 7: Deletion of Critical Civic Grievance by Non-Owner
- **Path**: `/complaints/comp1`
- **Operation**: `delete` (by unauthorized user)
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 8: Spam Posting in Unregistered Group Board
- **Path**: `/group_posts/gp_spam`
- **Operation**: `create`
- **Malicious Payload**:
  ```json
  {
    "id": "gp_spam",
    "groupId": "g_2",
    "content": "Spam message",
    "authorName": "Spammer"
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED` (Not a member of Prestige Heights group)

### Payload 9: Hijacking Local Job Board Contact details
- **Path**: `/jobs/job1`
- **Operation**: `update`
- **Malicious Payload**:
  ```json
  {
    "contactNumber": "9999999999"
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED` (Only original job poster can modify contact number)

### Payload 10: Unauthorized Modification of Immutable Field (createdAt)
- **Path**: `/complaints/comp1`
- **Operation**: `update`
- **Malicious Payload**:
  ```json
  {
    "createdAt": "2020-01-01T00:00:00Z"
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 11: Injecting Untrusted/Spoofed Timestamp for creation
- **Path**: `/complaints/comp_time`
- **Operation**: `create`
- **Malicious Payload**:
  ```json
  {
    "createdAt": "2026-06-25T10:00:00Z" // Expects request.time
  }
  ```
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 12: Blanket List Scrape (Querying users database without matching query parameters)
- **Path**: `/users`
- **Operation**: `list`
- **Expected Outcome**: `PERMISSION_DENIED` (Query must filter by exact own user ID to prevent scraping user list)

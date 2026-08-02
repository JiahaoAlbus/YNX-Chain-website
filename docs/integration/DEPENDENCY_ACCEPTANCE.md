# YNX Website Dependency Acceptance

Source commit: `1e998b5a2d09ab389fe0652f739aab7d1a352eb9`

| Dependency | Required evidence | State |
| --- | --- | --- |
| Product owners | source-bound metadata, release states, artifacts and risks | all 35 owner branches are represented in `public/releases/owner-record-index.json`; central owner acceptance remains pending and the snapshot does not promote observed branches |
| Chain Core | unique network identity and current public endpoint facts | pending central freeze |
| Explorer | canonical evidence routes and public proof | pending |
| Monitor | approved redacted status projection | pending |
| Integration | unique registry, conflicts and accepted source commits | pending |
| Security/SRE | deployment, CSP, secrets, rollback and incident acceptance | local checks only |
| Search providers | ownership, submission and index coverage | external evidence pending |

Website remains fail closed for missing owner records and never infers product
availability from a build, route, health response or repository file alone.

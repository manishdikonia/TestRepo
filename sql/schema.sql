-- Training & Assessment Management Platform - PostgreSQL Schema
-- Notes:
-- - Quizzes are modeled but intended for live-only usage; you may skip persisting them.
-- - Use UUIDs if preferred; bigint IDs are used here for simplicity.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core users and RBAC
CREATE TABLE IF NOT EXISTS users (
  id              BIGSERIAL PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(255) NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id          SMALLSERIAL PRIMARY KEY,
  name        VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS permissions (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id             BIGSERIAL PRIMARY KEY,
  role_id        SMALLINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id  BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id     SMALLINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  company_id  BIGINT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id, company_id)
);

-- Organizations
CREATE TABLE IF NOT EXISTS companies (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  domain      VARCHAR(255),
  hr_email    VARCHAR(255),
  phone       VARCHAR(50),
  metadata    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_users (
  id          BIGSERIAL PRIMARY KEY,
  company_id  BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        VARCHAR(50) NOT NULL CHECK (role IN ('HR','Manager','Other')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, user_id, role)
);

-- Coaches/Admins
CREATE TABLE IF NOT EXISTS coaches (
  id        BIGSERIAL PRIMARY KEY,
  user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio       TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS admins (
  id      BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

-- Participants (employees or individuals)
CREATE TABLE IF NOT EXISTS participants (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
  company_id   BIGINT NULL REFERENCES companies(id) ON DELETE SET NULL,
  designation  VARCHAR(100),
  status       VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','candidate')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Batches and membership (including HR/Management)
CREATE TABLE IF NOT EXISTS batches (
  id          BIGSERIAL PRIMARY KEY,
  company_id  BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name        VARCHAR(120) NOT NULL,
  start_date  DATE,
  end_date    DATE,
  max_size    INTEGER,
  coach_id    BIGINT NULL REFERENCES coaches(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batch_members (
  id               BIGSERIAL PRIMARY KEY,
  batch_id         BIGINT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  member_type      VARCHAR(20) NOT NULL CHECK (member_type IN ('participant','company_user')),
  participant_id   BIGINT NULL REFERENCES participants(id) ON DELETE CASCADE,
  company_user_id  BIGINT NULL REFERENCES company_users(id) ON DELETE CASCADE,
  added_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (member_type = 'participant' AND participant_id IS NOT NULL AND company_user_id IS NULL) OR
    (member_type = 'company_user' AND company_user_id IS NOT NULL AND participant_id IS NULL)
  ),
  UNIQUE(batch_id, member_type, COALESCE(participant_id, 0), COALESCE(company_user_id, 0))
);

-- Assessment tools and questions
CREATE TABLE IF NOT EXISTS assessment_tools (
  id         BIGSERIAL PRIMARY KEY,
  code       VARCHAR(50) UNIQUE NOT NULL,
  name       VARCHAR(120) NOT NULL,
  version    VARCHAR(20) NOT NULL DEFAULT '1.0',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  config     JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS questions (
  id         BIGSERIAL PRIMARY KEY,
  tool_id    BIGINT NOT NULL REFERENCES assessment_tools(id) ON DELETE CASCADE,
  sequence   INT NOT NULL,
  type       VARCHAR(20) NOT NULL CHECK (type IN ('mcq','scale','text')),
  prompt     TEXT NOT NULL,
  options    JSONB,
  metadata   JSONB DEFAULT '{}'::jsonb,
  UNIQUE(tool_id, sequence)
);

-- Assessments and results
CREATE TABLE IF NOT EXISTS assessments (
  id                    BIGSERIAL PRIMARY KEY,
  participant_id        BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  tool_id               BIGINT NOT NULL REFERENCES assessment_tools(id) ON DELETE RESTRICT,
  assigned_by_user_id   BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
  assigned_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status                VARCHAR(20) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned','in_progress','submitted')),
  submitted_at          TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS participant_answers (
  id             BIGSERIAL PRIMARY KEY,
  assessment_id  BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id    BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer         JSONB,
  answered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS assessment_results (
  id                        BIGSERIAL PRIMARY KEY,
  assessment_id             BIGINT NOT NULL UNIQUE REFERENCES assessments(id) ON DELETE CASCADE,
  auto_result               JSONB NOT NULL DEFAULT '{}'::jsonb,
  final_result              JSONB NOT NULL DEFAULT '{}'::jsonb,
  final_result_locked_at    TIMESTAMPTZ,
  calculated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Freeze rules
CREATE TABLE IF NOT EXISTS freeze_rules (
  id                   BIGSERIAL PRIMARY KEY,
  freeze_days          INT NOT NULL DEFAULT 30,
  scope                VARCHAR(20) NOT NULL DEFAULT 'global' CHECK (scope IN ('global','company','batch','participant','tool')),
  scope_id             BIGINT,
  allow_coach_override BOOLEAN NOT NULL DEFAULT TRUE
);

-- Assignments and submissions
CREATE TABLE IF NOT EXISTS assignments (
  id             BIGSERIAL PRIMARY KEY,
  assessment_id  BIGINT NOT NULL UNIQUE REFERENCES assessments(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  instructions   TEXT,
  due_at         TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id              BIGSERIAL PRIMARY KEY,
  assignment_id   BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  participant_id  BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  status          VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','graded')),
  notes           TEXT,
  file_url        TEXT,
  submitted_at    TIMESTAMPTZ,
  UNIQUE(assignment_id, participant_id)
);

-- Resources and batch unlocking
CREATE TABLE IF NOT EXISTS resources (
  id                        BIGSERIAL PRIMARY KEY,
  tool_id                   BIGINT NULL REFERENCES assessment_tools(id) ON DELETE SET NULL,
  title                     VARCHAR(255) NOT NULL,
  type                      VARCHAR(20) NOT NULL CHECK (type IN ('pdf','ppt','doc','link')),
  url                       TEXT NOT NULL,
  security_level            VARCHAR(20) NOT NULL DEFAULT 'view_only' CHECK (security_level IN ('view_only','watermarked')),
  visible_to_participants   BOOLEAN NOT NULL DEFAULT TRUE,
  visible_to_management     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS batch_resources (
  id                    BIGSERIAL PRIMARY KEY,
  batch_id              BIGINT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  resource_id           BIGINT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  unlocked_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unlocked_by_user_id   BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(batch_id, resource_id)
);

-- Interview candidates and packages
CREATE TABLE IF NOT EXISTS interview_candidates (
  id          BIGSERIAL PRIMARY KEY,
  company_id  BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50),
  status      VARCHAR(20) NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','submitted','hired','rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_packages (
  id            BIGSERIAL PRIMARY KEY,
  company_id    BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tool_id       BIGINT NOT NULL REFERENCES assessment_tools(id) ON DELETE RESTRICT,
  quota         INT NOT NULL,
  used_count    INT NOT NULL DEFAULT 0,
  purchased_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  UNIQUE(company_id, tool_id)
);

CREATE TABLE IF NOT EXISTS candidate_assessments (
  id            BIGSERIAL PRIMARY KEY,
  candidate_id  BIGINT NOT NULL REFERENCES interview_candidates(id) ON DELETE CASCADE,
  tool_id       BIGINT NOT NULL REFERENCES assessment_tools(id) ON DELETE RESTRICT,
  package_id    BIGINT NULL REFERENCES assessment_packages(id) ON DELETE SET NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned','submitted')),
  submitted_at  TIMESTAMPTZ
);

-- CRM sync
CREATE TABLE IF NOT EXISTS crm_sync_log (
  id            BIGSERIAL PRIMARY KEY,
  entity_type   VARCHAR(50) NOT NULL,
  entity_id     BIGINT NOT NULL,
  payload       JSONB NOT NULL DEFAULT '{}'::jsonb,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  error_message TEXT,
  synced_at     TIMESTAMPTZ
);

-- Initial RBAC seeds (optional)
INSERT INTO roles (id, name, description) VALUES
  (1, 'participant', 'Employee/individual participant'),
  (2, 'company', 'Company/Management user'),
  (3, 'coach', 'Coach/Trainer'),
  (4, 'admin', 'Super admin')
ON CONFLICT (id) DO NOTHING;

-- Example permission seeds (extend as needed)
INSERT INTO permissions (code, description) VALUES
  ('assessment:view', 'View assessments'),
  ('assessment:edit_final', 'Edit final results (within rules)'),
  ('assignment:unlock', 'Unlock assignments for batch'),
  ('resource:view', 'View resources'),
  ('resource:upload', 'Upload resources'),
  ('batch:manage', 'Create/update batches'),
  ('company:manage', 'Manage company and HR'),
  ('quiz:launch', 'Launch live quizzes'),
  ('reports:view', 'Access reports and analytics'),
  ('tools:manage', 'Manage assessment tools')
ON CONFLICT (code) DO NOTHING;


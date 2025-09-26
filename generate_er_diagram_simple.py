#!/usr/bin/env python3
"""
Generate ER Diagram for Training & Assessment Management Platform
Using Graphviz DOT format which can be converted to image
"""

# Generate DOT format for the ER diagram
dot_content = """
digraph ERDiagram {
    rankdir=TB;
    node [shape=record, style=filled, fillcolor=lightblue];
    edge [arrowhead=crow, arrowtail=none];
    
    // Entity Definitions
    
    Users [label="{USERS|PK: user_id\\l|email\\l|password_hash\\l|first_name\\l|last_name\\l|phone\\l|user_type\\l|is_active\\l|created_at\\l|updated_at\\l}" fillcolor="#E8F4FD"];
    
    Companies [label="{COMPANIES|PK: company_id\\l|company_name\\l|industry\\l|hr_contact_email\\l|hr_contact_phone\\l|address\\l|max_employees\\l|contract_start_date\\l|contract_end_date\\l|created_at\\l}" fillcolor="#E8F4FD"];
    
    Participants [label="{PARTICIPANTS|PK: participant_id\\l|FK: user_id\\l|FK: company_id\\l|FK: batch_id\\l|designation\\l|department\\l|employee_id\\l|participant_type\\l|joining_date\\l|is_interview_candidate\\l|hired_date\\l}" fillcolor="#E8F4FD"];
    
    Coaches [label="{COACHES|PK: coach_id\\l|FK: user_id\\l|specialization\\l|experience_years\\l|certification\\l|bio\\l|created_at\\l}" fillcolor="#E8F4FD"];
    
    Admins [label="{ADMINS|PK: admin_id\\l|FK: user_id\\l|role_level\\l|permissions\\l|created_at\\l}" fillcolor="#E8F4FD"];
    
    Batches [label="{BATCHES|PK: batch_id\\l|FK: company_id\\l|FK: coach_id\\l|batch_name\\l|batch_code\\l|start_date\\l|end_date\\l|max_participants\\l|status\\l}" fillcolor="#E8F4FD"];
    
    AssessmentTools [label="{ASSESSMENT_TOOLS|PK: tool_id\\l|tool_name\\l|tool_code\\l|description\\l|version\\l|is_active\\l|created_at\\l}" fillcolor="#E8F4FD"];
    
    Questions [label="{QUESTIONS|PK: question_id\\l|FK: tool_id\\l|question_text\\l|question_type\\l|options_json\\l|order_index\\l|is_required\\l}" fillcolor="#E8F4FD"];
    
    Assessments [label="{ASSESSMENTS|PK: assessment_id\\l|FK: participant_id\\l|FK: tool_id\\l|FK: batch_id\\l|assessment_date\\l|status\\l|start_time\\l|end_time\\l|assessment_score\\l|is_locked\\l|locked_date\\l}" fillcolor="#E8F4FD"];
    
    AssessmentResults [label="{ASSESSMENT_RESULTS|PK: result_id\\l|FK: assessment_id\\l|result_type\\l|calculated_result\\l|final_result\\l|edited_by\\l|edit_date\\l|freeze_date\\l}" fillcolor="#E8F4FD"];
    
    AssessmentResponses [label="{ASSESSMENT_RESPONSES|PK: response_id\\l|FK: assessment_id\\l|FK: question_id\\l|response_value\\l|response_time\\l|created_at\\l}" fillcolor="#E8F4FD"];
    
    Assignments [label="{ASSIGNMENTS|PK: assignment_id\\l|FK: tool_id\\l|title\\l|description\\l|instructions\\l|due_days\\l|max_score\\l|created_at\\l}" fillcolor="#E8F4FD"];
    
    ParticipantAssignments [label="{PARTICIPANT_ASSIGNMENTS|PK: participant_assignment_id\\l|FK: assignment_id\\l|FK: participant_id\\l|FK: batch_id\\l|assigned_date\\l|due_date\\l|submission_date\\l|submission_file\\l|score\\l|status\\l}" fillcolor="#E8F4FD"];
    
    Resources [label="{RESOURCES|PK: resource_id\\l|FK: tool_id\\l|title\\l|description\\l|resource_type\\l|file_path\\l|url\\l|is_downloadable\\l|created_at\\l}" fillcolor="#E8F4FD"];
    
    BatchResources [label="{BATCH_RESOURCES|PK: batch_resource_id\\l|FK: batch_id\\l|FK: resource_id\\l|unlocked_date\\l|unlocked_by\\l|access_level\\l}" fillcolor="#E8F4FD"];
    
    Quizzes [label="{QUIZZES|PK: quiz_id\\l|title\\l|description\\l|duration_minutes\\l|total_questions\\l|access_code\\l|is_active\\l}" fillcolor="#E8F4FD"];
    
    QuizQuestions [label="{QUIZ_QUESTIONS|PK: quiz_question_id\\l|FK: quiz_id\\l|question_text\\l|options_json\\l|correct_answer\\l|points\\l|order_index\\l}" fillcolor="#E8F4FD"];
    
    QuizSessions [label="{QUIZ_SESSIONS|PK: session_id\\l|FK: quiz_id\\l|FK: batch_id\\l|FK: coach_id\\l|start_time\\l|end_time\\l|access_link\\l|qr_code\\l}" fillcolor="#E8F4FD"];
    
    QuizResponses [label="{QUIZ_RESPONSES|PK: response_id\\l|FK: session_id\\l|FK: participant_id\\l|FK: quiz_question_id\\l|response\\l|is_correct\\l|response_time\\l}" fillcolor="#E8F4FD"];
    
    CompanyPackages [label="{COMPANY_PACKAGES|PK: package_id\\l|FK: company_id\\l|FK: tool_id\\l|total_assessments\\l|used_assessments\\l|package_type\\l|purchase_date\\l|expiry_date\\l}" fillcolor="#E8F4FD"];
    
    CoachAssignments [label="{COACH_ASSIGNMENTS|PK: assignment_id\\l|FK: coach_id\\l|FK: company_id\\l|assigned_date\\l|status\\l}" fillcolor="#E8F4FD"];
    
    SystemSettings [label="{SYSTEM_SETTINGS|PK: setting_id\\l|setting_key\\l|setting_value\\l|setting_type\\l|description\\l|updated_by\\l|updated_at\\l}" fillcolor="#E8F4FD"];
    
    AuditLogs [label="{AUDIT_LOGS|PK: log_id\\l|FK: user_id\\l|action\\l|entity_type\\l|entity_id\\l|old_value\\l|new_value\\l|timestamp\\l}" fillcolor="#E8F4FD"];
    
    CRMSyncLog [label="{CRM_SYNC_LOG|PK: sync_id\\l|FK: participant_id\\l|sync_type\\l|sync_status\\l|sync_data\\l|sync_timestamp\\l}" fillcolor="#E8F4FD"];
    
    // Relationships
    
    // User relationships
    Users -> Participants [label="1:0..1"];
    Users -> Coaches [label="1:0..1"];
    Users -> Admins [label="1:0..1"];
    Users -> AuditLogs [label="1:N"];
    
    // Company relationships
    Companies -> Participants [label="1:N"];
    Companies -> Batches [label="1:N"];
    Companies -> CompanyPackages [label="1:N"];
    Companies -> CoachAssignments [label="1:N"];
    
    // Participant relationships
    Participants -> Assessments [label="1:N"];
    Participants -> ParticipantAssignments [label="1:N"];
    Participants -> QuizResponses [label="1:N"];
    Participants -> CRMSyncLog [label="1:N"];
    
    // Batch relationships
    Batches -> Participants [label="1:N"];
    Batches -> Assessments [label="1:N"];
    Batches -> ParticipantAssignments [label="1:N"];
    Batches -> BatchResources [label="1:N"];
    Batches -> QuizSessions [label="1:N"];
    
    // Coach relationships
    Coaches -> Batches [label="1:N"];
    Coaches -> CoachAssignments [label="1:N"];
    Coaches -> QuizSessions [label="1:N"];
    
    // Assessment Tool relationships
    AssessmentTools -> Questions [label="1:N"];
    AssessmentTools -> Assessments [label="1:N"];
    AssessmentTools -> Assignments [label="1:N"];
    AssessmentTools -> Resources [label="1:N"];
    AssessmentTools -> CompanyPackages [label="1:N"];
    
    // Assessment relationships
    Assessments -> AssessmentResults [label="1:1..N"];
    Assessments -> AssessmentResponses [label="1:N"];
    
    // Question relationships
    Questions -> AssessmentResponses [label="1:N"];
    
    // Assignment relationships
    Assignments -> ParticipantAssignments [label="1:N"];
    
    // Resource relationships
    Resources -> BatchResources [label="1:N"];
    
    // Quiz relationships
    Quizzes -> QuizQuestions [label="1:N"];
    Quizzes -> QuizSessions [label="1:N"];
    QuizSessions -> QuizResponses [label="1:N"];
    QuizQuestions -> QuizResponses [label="1:N"];
}
"""

# Save the DOT file
with open('/workspace/er_diagram.dot', 'w') as f:
    f.write(dot_content)

print("DOT file created: er_diagram.dot")
print("\nTo convert this to an image, you can:")
print("1. Install Graphviz: apt-get install graphviz")
print("2. Run: dot -Tpng er_diagram.dot -o training_assessment_er_diagram.png")
print("3. Or: dot -Tjpg er_diagram.dot -o training_assessment_er_diagram.jpg")
print("\nAlternatively, you can use online tools like:")
print("- https://dreampuf.github.io/GraphvizOnline/")
print("- https://www.webgraphviz.com/")
print("\nJust copy the content of er_diagram.dot and paste it there.")
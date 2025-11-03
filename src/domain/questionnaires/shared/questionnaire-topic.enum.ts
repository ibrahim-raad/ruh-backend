import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum QuestionnaireTopic {
  CREATED = 'questionnaire.created',
  UPDATED = 'questionnaire.updated',
  REMOVED = 'questionnaire.removed',
}

export const QuestionnaireAuditTopic: Record<AuditEvent, QuestionnaireTopic> = {
  [AuditEvent.CREATED]: QuestionnaireTopic.CREATED,
  [AuditEvent.UPDATED]: QuestionnaireTopic.UPDATED,
  [AuditEvent.REMOVED]: QuestionnaireTopic.REMOVED,
};

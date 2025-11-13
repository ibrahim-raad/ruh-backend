import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { ChatMessageType } from '../shared/chat-message-type.enum';
import { TherapyCaseOutput } from 'src/domain/therapy-cases/dto/therapy-case.output';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class ChatMessageOutput extends AuditableOutput {
  readonly message: string;
  readonly type: ChatMessageType;
  readonly reply_to_id?: string;
  readonly received_at?: Date;
  readonly reply_to?: ChatMessageOutput;
  readonly therapy_case?: TherapyCaseOutput;
  readonly therapy_case_id?: string;
  readonly user?: UserOutput;
  readonly user_id?: string;
  readonly seen_at?: Date;
}

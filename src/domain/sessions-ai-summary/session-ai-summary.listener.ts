import { Injectable } from '@nestjs/common';
import { SessionAiSummaryService } from './session-ai-summary.service';

@Injectable()
export class SessionAiSummaryListener {
  constructor(
    private readonly sessionAiSummaryService: SessionAiSummaryService,
  ) {}

  // TODO: Create a summary when the session is finished
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { PatientAnswer } from './entities/patient-answer.entity';
import { SearchPatientAnswer } from './dto/search-patient-answer.dto';
import { PatientAnswerAudit } from './entities/patient-answer.entity.audit';
import { ClsService } from 'nestjs-cls';
import { User } from '../users/entities/user.entity';
import { PatientService } from '../patients/patient.service';
import { QuestionService } from '../questions/question.service';
import { PossibleAnswerService } from '../possible-answers/possible-answer.service';
import { SESSION_USER_KEY } from 'src/app.constants';

@Injectable()
export class PatientAnswerService extends CrudService<
  PatientAnswer,
  PatientAnswerAudit
> {
  constructor(
    @InjectRepository(PatientAnswer)
    protected readonly repository: Repository<PatientAnswer>,
    @InjectRepository(PatientAnswerAudit)
    auditRepository: Repository<PatientAnswerAudit>,
    private readonly clsService: ClsService,
    private readonly patientService: PatientService,
    private readonly questionService: QuestionService,
    private readonly possibleAnswerService: PossibleAnswerService,
  ) {
    super(PatientAnswer, repository, auditRepository, {
      question: {
        questionnaire: true,
      },
      possible_answer: {
        question: {
          questionnaire: true,
        },
      },
      patient: {
        user: {
          country: true,
        },
      },
    });
  }

  public async create(input: PatientAnswer): Promise<PatientAnswer> {
    const user = this.clsService.get<{ user: User | undefined }>(
      SESSION_USER_KEY,
    )?.user;
    const patient = await this.patientService.one({ user: { id: user?.id } });
    const question = await this.questionService.one({ id: input.question?.id });
    const possibleAnswer =
      (await this.possibleAnswerService.one(
        {
          id: input.possible_answer?.id,
        },
        {},
        false,
      )) ?? undefined;
    return super.create({
      ...input,
      patient,
      question,
      possible_answer: possibleAnswer,
    });
  }

  public async find(criteria: SearchPatientAnswer): Promise<PatientAnswer[]> {
    const where = {
      ...(isDefined(criteria.patient_id) && {
        patient: { id: criteria.patient_id },
      }),
      ...(isDefined(criteria.questionnaire_id) && {
        question: {
          questionnaire: { id: criteria.questionnaire_id },
        },
      }),
      ...(isDefined(criteria.question_id) && {
        question: {
          id: criteria.question_id,
          ...(isDefined(criteria.questionnaire_id) && {
            questionnaire: { id: criteria.questionnaire_id },
          }),
        },
      }),
      ...(isDefined(criteria.possible_answer_id) && {
        possible_answer: { id: criteria.possible_answer_id },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}

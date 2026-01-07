import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreatePatientAnswer } from './dto/create-patient-answer.dto';
import { PatientAnswer } from './entities/patient-answer.entity';
import { UpdatePatientAnswer } from './dto/update-patient-answer.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { PatientAnswerOutput } from './dto/patient-answer.output';
import { QuestionMapper } from '../questions/question.mapper';
import { PossibleAnswerMapper } from '../possible-answers/possible-answer.mapper';
import { PatientMapper } from '../patients/patient.mapper';

@Injectable()
export class PatientAnswerMapper {
  constructor(
    private readonly questionMapper: QuestionMapper,
    private readonly possibleAnswerMapper: PossibleAnswerMapper,
    private readonly patientMapper: PatientMapper,
  ) {}
  public toModel(input: CreatePatientAnswer): PatientAnswer;

  public toModel(
    input: UpdatePatientAnswer,
    existing: PatientAnswer,
  ): PatientAnswer;

  public toModel(
    input: CreatePatientAnswer | UpdatePatientAnswer,
    existing?: PatientAnswer,
  ): PatientAnswer {
    let data = {};

    if (input instanceof UpdatePatientAnswer) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        answer: input.answer ?? existing?.answer,
        possible_answer: input.possible_answer_id
          ? { id: input.possible_answer_id }
          : existing?.possible_answer,
        question: existing?.question,
      };
    } else {
      data = {
        answer: input.answer,
        possible_answer: input.possible_answer_id
          ? { id: input.possible_answer_id }
          : undefined,
        question: input.question_id ? { id: input.question_id } : undefined,
      };
    }
    return Object.assign(new PatientAnswer(), existing ?? {}, data);
  }

  public toOutput(input: PatientAnswer): PatientAnswerOutput {
    return Object.assign(new PatientAnswerOutput(), {
      id: input.id,
      answer: input.answer,
      possible_answer: input.possible_answer
        ? this.possibleAnswerMapper.toOutput(input.possible_answer)
        : undefined,
      patient: input.patient
        ? this.patientMapper.toOutput(input.patient)
        : undefined,
      patient_id: input.patientId,
      question: input.question
        ? this.questionMapper.toOutput(input.question)
        : undefined,
      question_id: input.questionId,
      possible_answer_id: input.possibleAnswerId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}

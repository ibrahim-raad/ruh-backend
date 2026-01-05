import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class JoinSessionDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;
}

export class OfferDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsObject()
  offer: RTCSessionDescriptionInit;
}

export class AnswerDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsObject()
  answer: RTCSessionDescriptionInit;
}

export class IceCandidateDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsObject()
  candidate: RTCIceCandidateInit;
}

// Define minimal WebRTC types if not available in the environment
// These interfaces ensure we don't use 'any'
export interface RTCSessionDescriptionInit {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
}

export interface RTCIceCandidateInit {
  candidate?: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
}

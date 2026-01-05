import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Logger,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import { JwtPayload } from '../auth/dto/jwt-payload';
import { UserService } from '../users/user.service';
import {
  AnswerDto,
  IceCandidateDto,
  JoinSessionDto,
  OfferDto,
} from './dto/session-gateway.dto';
import { User } from '../users/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'sessions',
})
@UsePipes(new ValidationPipe({ transform: true }))
export class SessionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SessionGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const secret = this.configService.get<AppConfig>('main')?.jwt?.secret;
      if (!secret) {
        throw new Error('JWT secret is not configured');
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: secret,
      });

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userService.one({ id: payload.id });

      (client.data as { user: User }).user = user;

      this.logger.log(`Client connected: ${client.id}, User ID: ${user.id}`);
    } catch (error) {
      this.logger.error(`Connection error: ${(error as Error).message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private extractToken(client: Socket): string | undefined {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    const tokenQuery = client.handshake.query.token;
    if (Array.isArray(tokenQuery)) {
      return tokenQuery[0];
    }
    return tokenQuery;
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinSessionDto,
  ): Promise<void> {
    const { sessionId } = payload;
    await client.join(sessionId);
    this.logger.log(`Client ${client.id} joined session ${sessionId}`);

    const user = (client.data as { user: User }).user;
    client.to(sessionId).emit('user_joined', { userId: user.id });
  }

  @SubscribeMessage('offer')
  handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: OfferDto,
  ) {
    this.logger.log(`Offer received for session ${payload.sessionId}`);
    const user = (client.data as { user: User }).user;
    client.to(payload.sessionId).emit('offer', {
      offer: payload.offer,
      senderId: user.id,
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AnswerDto,
  ) {
    this.logger.log(`Answer received for session ${payload.sessionId}`);
    const user = (client.data as { user: User }).user;
    client.to(payload.sessionId).emit('answer', {
      answer: payload.answer,
      senderId: user.id,
    });
  }

  @SubscribeMessage('ice_candidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: IceCandidateDto,
  ) {
    this.logger.log(`ICE candidate received for session ${payload.sessionId}`);
    const user = (client.data as { user: User }).user;
    client.to(payload.sessionId).emit('ice_candidate', {
      candidate: payload.candidate,
      senderId: user.id,
    });
  }
}

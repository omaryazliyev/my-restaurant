import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtStrategy'ni ishga tushiradi (auth/strategies/jwt.strategy.ts)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

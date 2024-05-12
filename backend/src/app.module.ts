import { Module } from '@nestjs/common';
import { PitchController } from './pitch/pitch.controller';

@Module({
  imports: [],
  controllers: [PitchController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [User],
      synchronize: true,
      port: 5433,
      username: 'admin',
      password: 'supersecret',
      host: 'localhost',
      database: 'express_prisma_db',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

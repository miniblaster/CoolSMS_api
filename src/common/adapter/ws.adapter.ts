/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

export class AuthWsAdapter extends IoAdapter {
  // private readonly authService:AuthService;
  constructor(private app: INestApplicationContext) {
    super(app);
    // this.authService = this.app.get(AuthService);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);
    return server;
  }
}

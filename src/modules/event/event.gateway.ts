/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';

import {
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(5555, { path: '/message', cors: true })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventGateway');
  private rooms: { [key: string]: string } = {};
  private clients: Set<string>;

  afterInit(server: Server) {
    console.log('Socket server initialized!');
  }

  handleConnection(@ConnectedSocket() client: any, req: any[]) {
    console.log(`Client connected: ${client.id}`);
    // client.join(client.id);
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    console.log(`Client disconnected: ${client.id}`);
    // client.leave(client.user.id)
  }

  @SubscribeMessage('msgToServer')
  onEvent(@ConnectedSocket() client: any, @MessageBody() payload: any) {
    client.emit('msgToClient', payload);
  }

  handleBroadcast(payload: any) {
    // Send message to room
    // this.server.to('someone').emit('message', 'Demo message');
    this.server.emit('msgToClient', payload);
  }
}

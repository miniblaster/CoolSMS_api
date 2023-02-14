import { Injectable } from '@nestjs/common';
import { GatewayQueryDto } from './dtos/gateway-query.dto';

import { MessageService } from '../message/message.service';
import { LineService } from '../line/line.service';
import { UserService } from '../user/user.service';

@Injectable()
export class GatewayService {
  constructor(
    private messageService: MessageService,
    private lineService: LineService,
    private userService: UserService,
  ) {}

  async processMessage(body: string, query: GatewayQueryDto, headers: any) {
    /**
     * TODO:
     * 1. Add message in messages table
     * 2. Get active subscriber associated with receiving number, get users with admin role
     * 3. Send websocket message to active subscriber/admins
     *  */
    const [sender, receiver, smsc, scts, ...text] = body.split('\n');
    const message = text.join('\n');

    const payload = {
      sender: query.sender,
      receiver: query.receiver,
      port: query.port,
      smsc: smsc.replace('SMSC: ', '').trim(),
      scts: scts.replace('SCTS: ', '').trim(),
      message,
      user: null,
    };
    const line = await this.lineService.findByPhoneNumber(query.receiver);
    if (line?.userLine && line.userLine.user) {
      payload.user = line.userLine.user;
    }

    await this.messageService.create(payload);

    return { sender, receiver, smsc, scts, message };
  }
}

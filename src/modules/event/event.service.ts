import { Injectable } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Injectable()
export class EventService {
  constructor(private eventGateway: EventGateway) {
    const handler = () =>
      this.eventGateway.handleBroadcast({ message: 'testing' });
    setInterval(handler, 5000);
  }
}

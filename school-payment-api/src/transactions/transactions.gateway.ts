import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TransactionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {

    console.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {

    console.log(`Client Disconnected: ${client.id}`);
  }

  sendUpdate() {
    console.log('Emitting [transactionsUpdated] event to all clients...');
    this.server.emit('transactionsUpdated');
  }
}
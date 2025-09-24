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
    // This will log when a frontend user connects
    console.log(`✅ Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // This will log when they disconnect
    console.log(`❌ Client Disconnected: ${client.id}`);
  }

  /**
   * Emits a 'transactionsUpdated' event to all connected clients.
   */
  sendUpdate() {
    // This will confirm the event is being sent
    console.log('📢 Emitting [transactionsUpdated] event to all clients...');
    this.server.emit('transactionsUpdated');
  }
}
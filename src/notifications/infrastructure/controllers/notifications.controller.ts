import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/application/notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly appService: NotificationsService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('subscribe')
  async subscribe(@Body() subscription: any): Promise<void> {
    // Almacena la suscripción en tu base de datos o donde prefieras
    // Normalmente se utilizaría una base de datos para manejar múltiples suscripciones
    // Aquí se almacena en una variable de clase solo con fines de demostración
    const currentSubs = NotificationsService.subscriptions;
    const finded = (currentSubs || []).findIndex(
      (sub) => sub.keys.auth === subscription.keys.auth,
    );
    if (finded === -1) {
      NotificationsService.subscriptions.push(subscription);
    } else if (
      (currentSubs[finded]?.body || '')?.includes('has unsubscribed or expired')
    ) {
      NotificationsService.subscriptions.splice(finded, 1);
      NotificationsService.subscriptions.push(subscription);
    }
  }
}

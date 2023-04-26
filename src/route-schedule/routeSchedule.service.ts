import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import { JourneyService } from '../journey/journey.service';
import { OrderedTravel } from '../journey/orderedTravel.entity';
import { OrderedTravelMetadata } from '../journey/orderedTravelMetadata.interface';
import { StandardRoute } from '../journey/standardRoute.entity';
import { UpcomingRoute } from '../journey/upcomingRoute.entity';

@Injectable()
export class RouteScheduleService {
  constructor(
    private journeyService: JourneyService,
    private emailService: EmailService,
  ) {}

  @Cron('0 * * * * *')
  async handleNewOrders() {
    const newOrders = await this.journeyService.getPendingOrders();

    if (!newOrders.length) return;
    newOrders.forEach(async (order: OrderedTravel) => {
      order.status = 'received';
      const travelMetadata: OrderedTravelMetadata = {
        startAddress: order.route.startAddress,
        endAddress: order.route.endAddress,
        distanceInKm: order.route.distance,
        duration: order.route.duration,
        price: order.price,
        email: order.user.email,
        date: order.date,
        confirmationCode: order.confirmationCode,
      };
      await this.emailService.sendTravelConfirmationMail(travelMetadata);
    });
    await this.journeyService.saveOrders(newOrders);
  }

  @Cron(CronExpression.EVERY_WEEK)
  async setUpcomingRoutes() {
    const standardRoutes = await this.journeyService.getRoutes();
    const upcomingRoutes: UpcomingRoute[] = [];
    standardRoutes.forEach((route: StandardRoute) => {
      if (route.day) {
        const upcomingRouteDate = new Date(
          Date.now() +
            1000 * 60 * 60 * (parseInt(route.hour) + 2) +
            1000 * 60 * 60 * 24 * (route.day.order - 1),
        );

        const upcomingRoute = {
          route: route,
          date: upcomingRouteDate,
        };

        upcomingRoutes.push(upcomingRoute);
      }
    });
    await this.journeyService.saveUpcomingRoutes(upcomingRoutes);
  }
}

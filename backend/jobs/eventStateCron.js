import cron from 'node-cron';
import Event from '../models/Event.js';
import { Op } from 'sequelize';

export function startEventStateCron() {
  // run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // open events whose startTime <= now < endTime and are CLOSED
      const toOpen = await Event.findAll({
        where: {
          startTime: { [Op.lte]: now },
          endTime: { [Op.gt]: now },
          state: 'CLOSED'
        }
      });
      for (const e of toOpen) {
        await e.update({ state: 'OPEN' });
        console.log('Opened event', e.id);
      }

      // close events whose endTime <= now and are OPEN
      const toClose = await Event.findAll({
        where: {
          endTime: { [Op.lte]: now },
          state: 'OPEN'
        }
      });
      for (const e of toClose) {
        await e.update({ state: 'CLOSED' });
        console.log('Closed event', e.id);
      }

    } catch (err) {
      console.error('Cron error', err);
    }
  });
}

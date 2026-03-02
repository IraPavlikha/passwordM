import * as Notifications from 'expo-notifications';

export const NotificationService = {
  async schedulePasswordReminders(passwords: any[], reminderDays: string) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const daysLimit = parseInt(reminderDays);
    if (daysLimit === 0 || passwords.length === 0) return;

    const now = Date.now();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    for (const item of passwords) {
      const created = item.createdAt || now;
      const daysPassed = (now - created) / MS_PER_DAY;
      const daysLeft = daysLimit - daysPassed;
      const triggerSeconds = daysLeft > 0 ? daysLeft * MS_PER_DAY / 1000 : 5;

      if (triggerSeconds > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Час оновити пароль 🔐",
            body: `Пароль для ${item.service} рекомендується змінити для вашої безпеки.`,
            data: { serviceId: item.id },
          },
          trigger: {
            seconds: Math.floor(triggerSeconds),
            repeats: false,
          },
        });
      }
    }
  }
};
package kz.sirius.kidssecurity;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class ActionButtonBroadcastReceiver extends BroadcastReceiver {
	@Override
	public void onReceive(Context context, Intent intent) {
		int notificationId = intent.getIntExtra("notificationId", 0);
		if (notificationId == MyExpoFcmMessagingService.NOTIFICATION_ID) {
			MyExpoFcmMessagingService.dismissNotifications(context);
		}
	}
}

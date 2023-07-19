package kz.sirius.kidssecurity;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.RingtoneManager;
import androidx.core.app.NotificationCompat;

import android.util.Base64;

import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;
import java.util.Random;

//import de.greenrobot.event.EventBus;
import expo.modules.notifications.service.ExpoFirebaseMessagingService;

public class MyExpoFcmMessagingService extends ExpoFirebaseMessagingService {
	public static final int NOTIFICATION_ID = 324234;

  @Override
	public void onMessageReceived(RemoteMessage remoteMessage) {
		final Map<String, String> data = remoteMessage.getData();
		final String kind = data.get("kind");
		System.out.println(" ===== PUSH: " + kind);
		if ("TEXT_MESSAGE".equals(kind) || "VOICE_MAIL".equals(kind)) {
			boolean background = false;
			JSONObject body = null;
			if (data.containsKey("body")) {
				try {
					body = new JSONObject(data.get("body"));
					background = body.has("background") && body.getBoolean("background");
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
			final String URL_DELIVERED = "https://server.kidsecurity.tech/messagedelivered/";
			final String objectId = data.get("objectId");
			final String mailId = data.get("mailId");

			final String username = "demo";
			final String url = URL_DELIVERED + Base64.encodeToString(username.getBytes(), Base64.NO_WRAP) + "/" + objectId + "/" + mailId;
			try {
				final String reply = getUrlContent(url);
				System.out.println(" === delivery notification result: " + reply);
			} catch (Exception e) {
				e.printStackTrace();
			}
			// TODO: remove from production
			//showAddChildNotification();

			// Проталкиваем уведомление в запущенное expo приложение без отображения нотификации
			/*final ReceivedNotificationEvent notificationEvent = new ReceivedNotificationEvent(remoteMessage.getData().get("experienceId"), remoteMessage.getData().get("body"), new Random().nextInt(), false, true);
			EventBus.getDefault().post(notificationEvent);*/
			super.onMessageReceived(remoteMessage);
			return;
		}

		if ("PROMO".equals(kind) && "ADD_DEVICE".equals(data.get("type"))) {
			showAddChildNotification();
			return;
		}

		if ("1".equals(data.get("eventQualifier")) && "120".equals(data.get("eventCode"))) {
			if (null == remoteMessage.getNotification()) {
				final Intent intent = new Intent(this, SosActivity.class);
				intent.putExtra("name", remoteMessage.getData().get("title"));
				intent.putExtra("photo", remoteMessage.getData().get("photo"));
				intent.putExtra("objectId", remoteMessage.getData().get("objectId"));
				intent.addFlags(/*Intent.FLAG_ACTIVITY_CLEAR_TOP |*/ Intent.FLAG_ACTIVITY_NEW_TASK);
				startActivity(intent);
				// return;
			}
		}


		//System.out.println("==============================\n\r" + remoteMessage.getData().get("body"));
		super.onMessageReceived(remoteMessage);
	}

	public static String getUrlContent(String urlName) throws Exception {
		final URL url = new URL(urlName);
		final URLConnection con = url.openConnection();

		final StringBuffer response = new StringBuffer();
		try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
			String inputLine;
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
		}

		return response.toString();
	}

  private void showAddChildNotification() {
		final String CHANNEL_ID = "alert";

		Intent notifyIntent = getPackageManager().getLaunchIntentForPackage("kz.sirius.kidssecurity");
		// Set the Activity to start in a new, empty task
		notifyIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
		// Create the PendingIntent

    PendingIntent notifyPendingIntent;
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
      notifyPendingIntent = PendingIntent.getActivity(
        this,
        0, notifyIntent,
        PendingIntent.FLAG_IMMUTABLE);
    }
    else
    {
      notifyPendingIntent = PendingIntent.getActivity(
        this,
        0, notifyIntent,
        PendingIntent.FLAG_UPDATE_CURRENT);
    }
		//Create an Intent for the BroadcastReceiver
		Intent buttonIntent = new Intent(this, ActionButtonBroadcastReceiver.class);
		buttonIntent.putExtra("notificationId", NOTIFICATION_ID);
		//Create the PendingIntent
		PendingIntent btPendingIntent;
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
      btPendingIntent = PendingIntent.getActivity(
        this,
        0, buttonIntent,
        PendingIntent.FLAG_IMMUTABLE);
    }
    else
    {
      btPendingIntent = PendingIntent.getActivity(
        this,
        0, buttonIntent,
        PendingIntent.FLAG_UPDATE_CURRENT);
    }

		final Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.ic_add_child_remind);
    final Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
				.setContentTitle(getString(R.string.abc_push_connect_child))
				.setContentText(getString(R.string.abc_push_to_know_where_he))
				.setSubText(getString(R.string.abc_push_in_case_of_danger))
				.setLargeIcon(bitmap)
        .setSmallIcon(R.drawable.ic_notification)
				.setStyle(new NotificationCompat.BigPictureStyle()
						.bigPicture(bitmap)
//						.bigLargeIcon(null)
						.setSummaryText(getString(R.string.abc_push_in_case_of_danger)))
        .setColor(getResources().getColor(R.color.white))
				.addAction(0, getString(R.string.abc_push_action_later), btPendingIntent)
				.addAction(0, getString(R.string.abc_push_action_now), notifyPendingIntent)
				.setVibrate(new long[] { 0, 250, 250, 250 })
				.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
				.setContentIntent(notifyPendingIntent)
				.build();
		final NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
		notificationManager.notify(NOTIFICATION_ID, notification);
	}

	public static void dismissNotifications(Context context) {
		final NotificationManager notificationManager = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
		notificationManager.cancel(NOTIFICATION_ID);
	}
}

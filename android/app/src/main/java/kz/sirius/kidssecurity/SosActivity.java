package kz.sirius.kidssecurity;

import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

import androidx.appcompat.app.AppCompatActivity;

public class SosActivity extends AppCompatActivity {

  private MediaPlayer mMediaPlayer;
  private long objectId = 0;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_sos);
    System.out.println(" =========== SOS activity onCreate");

    final TextView name = findViewById(R.id.childName);
    name.setText(getIntent().getStringExtra("name"));
    objectId = getIntent().getLongExtra("objectId", 0);

    // https://stackoverflow.com/questions/22105775/imageview-in-circular-through-xml
    final String photo = getIntent().getStringExtra("photo");
    if (null != photo) {
      final ImageView imageView = findViewById(R.id.photo);
      Glide.with(this).load(photo).into(imageView);
    }

    turnOnScreen();
  }

  private void turnOnScreen() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      this.setShowWhenLocked(true);
      this.setTurnScreenOn(true);
      final KeyguardManager km = ((KeyguardManager) getSystemService(KEYGUARD_SERVICE));
      km.requestDismissKeyguard(this, new KeyguardManager.KeyguardDismissCallback() {
      });
    } else {
      final Window window = getWindow();
      window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
    }
  }

  public void openApp(View view) {
    finish();
    final Intent intent = getPackageManager().getLaunchIntentForPackage("kz.sirius.kidssecurity");
    if (intent != null) {
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
      intent.putExtra("centerToOid", objectId);
      startActivity(intent);//null pointer check in case package name was not found
    }
  }

  @Override
  protected void onResume() {
    super.onResume();
    enable();
  }

  @Override
  protected void onPause() {
    super.onPause();
    disable();
  }

  public void enable() {
    disable();
    mMediaPlayer = MediaPlayer.create(this, R.raw.sos);
    mMediaPlayer.setLooping(true);
    //mMediaPlayer.setVolume(1, 1);
    mMediaPlayer.start();
    AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
    am.setStreamVolume(
      AudioManager.STREAM_MUSIC,
      am.getStreamMaxVolume(AudioManager.STREAM_MUSIC),
      0);
  }

  public void disable() {
    if (null != mMediaPlayer) {
      mMediaPlayer.release();
      mMediaPlayer = null;
    }
  }

  @Override
  public void onBackPressed() {
  }
}

package expo.modules.compass

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoCompassModule : Module(), SensorEventListener {
  private val sensorManager: SensorManager by lazy {
    appContext.reactContext?.getSystemService(Context.SENSOR_SERVICE) as SensorManager
  }

  private var isListening = false
  private var rotationVectorSensor: Sensor? = null
  private var accelerometerSensor: Sensor? = null
  private var magnetometerSensor: Sensor? = null

  private val gravity = FloatArray(3)
  private val geomagnetic = FloatArray(3)
  private var hasGravity = false
  private var hasGeomagnetic = false

  override fun definition() = ModuleDefinition {
    Name("ExpoCompass")

    Events("onHeadingChange")

    AsyncFunction("start") {
      startListening()
    }

    AsyncFunction("stop") {
      stopListening()
    }
  }

  private fun startListening() {
    if (isListening) return

    rotationVectorSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)
    if (rotationVectorSensor != null) {
      sensorManager.registerListener(this, rotationVectorSensor, SensorManager.SENSOR_DELAY_UI)
    } else {
      accelerometerSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
      magnetometerSensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)
      sensorManager.registerListener(this, accelerometerSensor, SensorManager.SENSOR_DELAY_UI)
      sensorManager.registerListener(this, magnetometerSensor, SensorManager.SENSOR_DELAY_UI)
    }
    isListening = true
  }

  private fun stopListening() {
    if (!isListening) return
    sensorManager.unregisterListener(this)
    isListening = false
    hasGravity = false
    hasGeomagnetic = false
  }

  override fun onSensorChanged(event: SensorEvent?) {
    if (event == null) return

    var azimuth = 0f

    if (event.sensor.type == Sensor.TYPE_ROTATION_VECTOR) {
      val rotationMatrix = FloatArray(9)
      SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values)
      val orientation = FloatArray(3)
      SensorManager.getOrientation(rotationMatrix, orientation)
      azimuth = Math.toDegrees(orientation[0].toDouble()).toFloat()
    } else {
      if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
        System.arraycopy(event.values, 0, gravity, 0, event.values.size)
        hasGravity = true
      } else if (event.sensor.type == Sensor.TYPE_MAGNETIC_FIELD) {
        System.arraycopy(event.values, 0, geomagnetic, 0, event.values.size)
        hasGeomagnetic = true
      }

      if (hasGravity && hasGeomagnetic) {
        val r = FloatArray(9)
        val i = FloatArray(9)
        if (SensorManager.getRotationMatrix(r, i, gravity, geomagnetic)) {
          val orientation = FloatArray(3)
          SensorManager.getOrientation(r, orientation)
          azimuth = Math.toDegrees(orientation[0].toDouble()).toFloat()
        }
      } else {
        return
      }
    }

    val heading = (azimuth + 360) % 360

    sendEvent("onHeadingChange", bundleOf(
      "magneticHeading" to heading.toDouble(),
      "trueHeading" to heading.toDouble(),
      "headingAccuracy" to 1.0,
      "timestamp" to System.currentTimeMillis().toDouble()
    ))
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}

from moviepy.editor import *
import numpy as np
import cv2  # MoviePy relies on imageio, but cv2 helps with resizing frames

# Load audio and image
audio = AudioFileClip("someDayAtChristmasStevie.mp3")
image = ImageClip("ocean_scene.png").set_duration(audio.duration)
image = image.resize(height=480)

# Define smooth zoom (Ken Burns) using OpenCV resize
def soft_zoom(get_frame, t):
    frame = get_frame(t)
    zoom = 1 + 0.02 * (t / audio.duration)  # up to +2%
    h, w = frame.shape[:2]
    new_h, new_w = int(h / zoom), int(w / zoom)
    y1 = (h - new_h) // 2
    x1 = (w - new_w) // 2
    cropped = frame[y1:y1 + new_h, x1:x1 + new_w]
    resized = cv2.resize(cropped, (w, h), interpolation=cv2.INTER_CUBIC)
    return resized

# Apply gentle zoom to each frame
animated = image.fl(soft_zoom, apply_to=[])

# Combine with audio
final = animated.set_audio(audio).set_fps(24)

# Export video
final.write_videofile(
    "someDayAtChristmasStevie.mp4",
    codec="libx264",
    audio_codec="aac",
    fps=24,
    threads=4
)

import moviepy.editor as mp

print("✅ MoviePy editor module imported successfully!")

audio = mp.AudioFileClip("prayer4TheDay.aac")
print(f"Audio duration: {audio.duration} seconds")

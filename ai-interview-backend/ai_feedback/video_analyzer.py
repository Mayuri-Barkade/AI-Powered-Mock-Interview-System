import cv2
import numpy as np
import base64

# Use OpenCV's built-in haarcascade — no download needed
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


def decode_frame(base64_image: str) -> np.ndarray:
    if ',' in base64_image:
        base64_image = base64_image.split(',')[1]
    img_bytes = base64.b64decode(base64_image)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    frame     = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return frame


def analyze_frame(base64_image: str) -> dict:
    try:
        frame = decode_frame(base64_image)
        if frame is None:
            return _default_scores("Could not decode image")

        height, width = frame.shape[:2]
        gray          = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Equalize histogram to handle poor lighting
        gray = cv2.equalizeHist(gray)

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.05,
            minNeighbors=3,
            minSize=(20, 20),
        )

        face_count = len(faces)

        if face_count == 0:
            return {
                'eyeContactScore':  0,
                'postureScore':     0,
                'confidenceScore':  0,
                'eyeContact':       'Poor',
                'posture':          'Sit up',
                'faceCount':        0,
                'warning':          'no_face',
            }

        largest = max(faces, key=lambda f: f[2] * f[3])
        x, y, w, h = largest

        # Eye contact — how centred is the face
        face_cx = x + w / 2
        face_cy = y + h / 2
        dx = abs(face_cx - width  / 2) / (width  / 2)
        dy = abs(face_cy - height / 2) / (height / 2)
        dist              = (dx ** 2 + dy ** 2) ** 0.5 / (2 ** 0.5)
        eye_contact_score = round((1 - min(dist, 1)) * 100)

        # Posture — face size relative to frame
        face_ratio    = h / height
        posture_score = round(min(1, max(0, (face_ratio - 0.12) / (0.38 - 0.12))) * 100)

        # Confidence — brightness of face region
        face_region   = gray[y:y+h, x:x+w]
        brightness    = np.mean(face_region)
        conf_score    = round(min(1, max(0, (brightness - 60) / (160 - 60))) * 100)

        return {
            'eyeContactScore':  eye_contact_score,
            'postureScore':     posture_score,
            'confidenceScore':  conf_score,
            'eyeContact':       'Good' if eye_contact_score >= 60 else 'Poor',
            'posture':          'Good' if posture_score     >= 55 else 'Sit up',
            'faceCount':        face_count,
            'warning':          'multiple_faces' if face_count > 1 else None,
        }

    except Exception as e:
        print(f"analyze_frame error: {e}")
        return _default_scores(str(e))


def _default_scores(reason: str = "") -> dict:
    return {
        'eyeContactScore':  0,
        'postureScore':     0,
        'confidenceScore':  0,
        'eyeContact':       'Unknown',
        'posture':          'Unknown',
        'faceCount':        0,
        'warning':          None,
        'error':            reason,
    }
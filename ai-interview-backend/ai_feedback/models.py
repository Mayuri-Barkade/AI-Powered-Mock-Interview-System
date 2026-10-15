# from django.db import models

# # Create your models here.
# from django.db import models
# from accounts.models import User


# class InterviewSession(models.Model):
#     """One complete interview session by a user."""
#     user = models.ForeignKey(
#         User, on_delete=models.CASCADE, related_name='sessions'
#     )
#     session_id = models.CharField(max_length=100, unique=True)
#     role = models.CharField(max_length=100)
#     average_score = models.FloatField(default=0)
#     completed_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-completed_at']

#     def __str__(self):
#         return f"{self.user.username} — {self.role} ({self.completed_at.strftime('%Y-%m-%d')})"


# class QuestionResponse(models.Model):
#     """One question + answer + AI feedback within a session."""
#     session = models.ForeignKey(
#         InterviewSession, on_delete=models.CASCADE, related_name='responses'
#     )
#     question_id = models.CharField(max_length=100)
#     question_text = models.TextField()
#     answer = models.TextField()

#     # AI scores
#     relevance = models.IntegerField(default=0)
#     technical_accuracy = models.IntegerField(default=0)
#     communication_clarity = models.IntegerField(default=0)
#     overall_score = models.IntegerField(default=0)

#     # AI written feedback (stored as JSON text)
#     strengths = models.JSONField(default=list)
#     improvements = models.JSONField(default=list)
#     suggestions = models.JSONField(default=list)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Q: {self.question_text[:60]}... | Score: {self.overall_score}"


# class AIEvaluationLog(models.Model):
#     """Raw log of every evaluate API call for debugging."""
#     question_text = models.TextField()
#     expected_topics = models.JSONField(default=list)
#     answer = models.TextField()
#     response_json = models.JSONField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "AI Evaluation Log"

#     def __str__(self):
#         return f"Log #{self.pk} — {self.created_at.strftime('%Y-%m-%d %H:%M')}"
from django.db import models
from accounts.models import User


class InterviewSession(models.Model):
    user          = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_id    = models.CharField(max_length=100, unique=True)
    role          = models.CharField(max_length=100)
    average_score = models.FloatField(default=0)
    completed_at  = models.DateTimeField(auto_now_add=True)

    # Video analysis scores
    eye_contact_score = models.IntegerField(default=0)
    posture_score     = models.IntegerField(default=0)
    video_confidence  = models.IntegerField(default=0)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} — {self.role} ({self.completed_at.strftime('%Y-%m-%d')})"


class QuestionResponse(models.Model):
    session       = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='responses')
    question_id   = models.CharField(max_length=100)
    question_text = models.TextField()
    answer        = models.TextField()

    relevance             = models.IntegerField(default=0)
    technical_accuracy    = models.IntegerField(default=0)
    communication_clarity = models.IntegerField(default=0)
    overall_score         = models.IntegerField(default=0)

    strengths    = models.JSONField(default=list)
    improvements = models.JSONField(default=list)
    suggestions  = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q: {self.question_text[:60]}... | Score: {self.overall_score}"


class AIEvaluationLog(models.Model):
    question_text   = models.TextField()
    expected_topics = models.JSONField(default=list)
    answer          = models.TextField()
    response_json   = models.JSONField()
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering     = ['-created_at']
        verbose_name = "AI Evaluation Log"

    def __str__(self):
        return f"Log #{self.pk} — {self.created_at.strftime('%Y-%m-%d %H:%M')}"
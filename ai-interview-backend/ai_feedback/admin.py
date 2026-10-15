# from django.contrib import admin

# # Register your models here.
# from django.contrib import admin
# from .models import InterviewSession, QuestionResponse, AIEvaluationLog


# class QuestionResponseInline(admin.TabularInline):
#     model = QuestionResponse
#     extra = 0
#     readonly_fields = [
#         'question_id', 'question_text', 'answer',
#         'relevance', 'technical_accuracy', 'communication_clarity',
#         'overall_score', 'strengths', 'improvements', 'suggestions', 'created_at'
#     ]
#     can_delete = False


# @admin.register(InterviewSession)
# class InterviewSessionAdmin(admin.ModelAdmin):
#     list_display = ['user', 'role', 'average_score', 'completed_at']
#     list_filter = ['role', 'completed_at']
#     search_fields = ['user__username', 'user__email', 'session_id']
#     readonly_fields = ['session_id', 'completed_at']
#     inlines = [QuestionResponseInline]


# @admin.register(QuestionResponse)
# class QuestionResponseAdmin(admin.ModelAdmin):
#     list_display = [
#         'session', 'question_text_short', 'overall_score',
#         'relevance', 'technical_accuracy', 'communication_clarity'
#     ]
#     list_filter = ['session__role']
#     search_fields = ['question_text', 'answer', 'session__user__username']
#     readonly_fields = ['created_at']

#     def question_text_short(self, obj):
#         return obj.question_text[:70] + '...' if len(obj.question_text) > 70 else obj.question_text
#     question_text_short.short_description = 'Question'


# @admin.register(AIEvaluationLog)
# class AIEvaluationLogAdmin(admin.ModelAdmin):
#     list_display = ['id', 'question_preview', 'created_at']
#     readonly_fields = [
#         'question_text', 'expected_topics', 'answer',
#         'response_json', 'created_at'
#     ]
#     search_fields = ['question_text', 'answer']

#     def question_preview(self, obj):
#         return obj.question_text[:80]
#     question_preview.short_description = 'Question'
from django.contrib import admin
from .models import InterviewSession, QuestionResponse, AIEvaluationLog


class QuestionResponseInline(admin.TabularInline):
    model         = QuestionResponse
    extra         = 0
    readonly_fields = [
        'question_id', 'question_text', 'answer',
        'relevance', 'technical_accuracy', 'communication_clarity',
        'overall_score', 'strengths', 'improvements', 'suggestions', 'created_at',
    ]
    can_delete = False


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'role', 'average_score',
        'eye_contact_score', 'posture_score', 'video_confidence',
        'completed_at',
    ]
    list_filter   = ['role', 'completed_at']
    search_fields = ['user__username', 'user__email', 'session_id']
    readonly_fields = ['session_id', 'completed_at']
    inlines       = [QuestionResponseInline]

    fieldsets = (
        ('Session Info', {
            'fields': ('user', 'session_id', 'role', 'average_score', 'completed_at'),
        }),
        ('Video Analysis', {
            'fields': ('eye_contact_score', 'posture_score', 'video_confidence'),
            'description': 'Scores captured from live camera during the interview (0–100)',
        }),
    )


@admin.register(QuestionResponse)
class QuestionResponseAdmin(admin.ModelAdmin):
    list_display  = [
        'session', 'question_text_short', 'overall_score',
        'relevance', 'technical_accuracy', 'communication_clarity',
    ]
    list_filter   = ['session__role']
    search_fields = ['question_text', 'answer', 'session__user__username']
    readonly_fields = ['created_at']

    def question_text_short(self, obj):
        return obj.question_text[:70] + '...' if len(obj.question_text) > 70 else obj.question_text
    question_text_short.short_description = 'Question'


@admin.register(AIEvaluationLog)
class AIEvaluationLogAdmin(admin.ModelAdmin):
    list_display  = ['id', 'question_preview', 'created_at']
    readonly_fields = [
        'question_text', 'expected_topics', 'answer',
        'response_json', 'created_at',
    ]
    search_fields = ['question_text', 'answer']

    def question_preview(self, obj):
        return obj.question_text[:80]
    question_preview.short_description = 'Question'
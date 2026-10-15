from django.urls import path
from .views import (
    EvaluateAnswerView,
    SaveSessionView,
    GetSessionsView,
    GetSessionDetailView,
    ClearSessionsView,
    AdminPerformanceView,
    AnalyzeFrameView,
)
from .questions_view import GetQuestionsView   
urlpatterns = [
    path('evaluate/',                       EvaluateAnswerView.as_view(),   name='evaluate'),
    path('save-session/',                   SaveSessionView.as_view(),      name='save-session'),
    path('sessions/<int:user_id>/',         GetSessionsView.as_view(),      name='get-sessions'),
    path('session/<str:session_id>/',       GetSessionDetailView.as_view(), name='get-session-detail'),
    path('clear-sessions/<int:user_id>/',   ClearSessionsView.as_view(),    name='clear-sessions'),
    path('admin/performance/',              AdminPerformanceView.as_view(), name='admin-performance'),
    path('analyze-frame/', AnalyzeFrameView.as_view(), name='analyze_frame'),
    path('questions/', GetQuestionsView.as_view(), name='get-questions'),
]
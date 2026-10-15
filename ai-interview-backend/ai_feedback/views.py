# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import AIEvaluationLog, InterviewSession, QuestionResponse
# from .ml_scorer import predict_scores
# from accounts.models import User
# from .video_analyzer import analyze_frame

# class EvaluateAnswerView(APIView):
#     def post(self, request):
#         question_data   = request.data.get('question', {})
#         answer          = request.data.get('answer', '')
#         question_text   = question_data.get('text', '')
#         expected_topics = question_data.get('expectedTopics', [])

#         if not question_text or not answer:
#             return Response({'error': 'question and answer are required'}, status=400)

#         scores = predict_scores(
#             question=question_text,
#             topics=expected_topics,
#             answer=answer,
#         )

#         result = {
#         'relevance':            scores['relevance_score'],
#         'technicalAccuracy':    scores['technical_score'],
#         'communicationClarity': scores['communication_score'],
#         'overallScore':         scores['overall_score'],
#         'strengths':            scores['strengths'],
#         'improvements':         scores['improvements'],
#         'suggestions':          scores['suggestions'],
#         'coveredTopics':        scores.get('covered_topics', []),
#         'missingTopics':        scores.get('missing_topics', []),
#         'validity':             scores.get('validity', {'valid': True, 'reason': 'OK', 'penalty': 0.0}),
#     }

#         AIEvaluationLog.objects.create(
#             question_text=question_text,
#             expected_topics=expected_topics,
#             answer=answer,
#             response_json=result,
#         )

#         return Response(result)


# class SaveSessionView(APIView):
#     def post(self, request):
#         data    = request.data
#         user_id = data.get('userId')

#         try:
#             user = User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=404)

#         session = InterviewSession.objects.create(
#             user=user,
#             session_id=data['id'],
#             role=data.get('role', ''),
#             average_score=data.get('averageScore', 0),
#         )

#         for resp in data.get('responses', []):
#             feedback = resp.get('feedback', {})
#             QuestionResponse.objects.create(
#                 session=session,
#                 question_id=str(resp.get('questionId', '')),
#                 question_text=resp.get('questionText', ''),
#                 answer=resp.get('answer', ''),
#                 relevance=feedback.get('relevance', 0),
#                 technical_accuracy=feedback.get('technicalAccuracy', 0),
#                 communication_clarity=feedback.get('communicationClarity', 0),
#                 overall_score=feedback.get('overallScore', 0),
#                 strengths=feedback.get('strengths', []),
#                 improvements=feedback.get('improvements', []),
#                 suggestions=feedback.get('suggestions', []),
#             )

#         return Response({'status': 'saved', 'sessionId': session.session_id})


# class GetSessionsView(APIView):
#     def get(self, request, user_id):
#         try:
#             user = User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=404)

#         sessions = InterviewSession.objects.filter(user=user).order_by('-completed_at')
#         data = []
#         for s in sessions:
#             responses = []
#             for r in s.responses.all():
#                 responses.append({
#                     'questionId':   int(r.question_id) if r.question_id.isdigit() else r.question_id,
#                     'questionText': r.question_text,
#                     'answer':       r.answer,
#                     'score':        r.overall_score,
#                     'feedback': {
#                         'relevance':            r.relevance,
#                         'technicalAccuracy':    r.technical_accuracy,
#                         'communicationClarity': r.communication_clarity,
#                         'overallScore':         r.overall_score,
#                         'strengths':            r.strengths,
#                         'improvements':         r.improvements,
#                         'suggestions':          r.suggestions,
#                     }
#                 })
#             data.append({
#                 'id':           s.session_id,
#                 'role':         s.role,
#                 'date':         s.completed_at.isoformat(),
#                 'averageScore': int(s.average_score),   # ← fixed typo (backtick removed)
#                 'status':       'completed',
#                 'responses':    responses,
#             })

#         return Response(data)


# class GetSessionDetailView(APIView):
#     def get(self, request, session_id):
#         try:
#             s = InterviewSession.objects.get(session_id=session_id)
#         except InterviewSession.DoesNotExist:
#             return Response({'error': 'Session not found'}, status=404)

#         responses = []
#         for r in s.responses.all():
#             responses.append({
#                 'questionId':   int(r.question_id) if r.question_id.isdigit() else r.question_id,
#                 'questionText': r.question_text,
#                 'answer':       r.answer,
#                 'score':        r.overall_score,
#                 'feedback': {
#                     'relevance':            r.relevance,
#                     'technicalAccuracy':    r.technical_accuracy,
#                     'communicationClarity': r.communication_clarity,
#                     'overallScore':         r.overall_score,
#                     'strengths':            r.strengths,
#                     'improvements':         r.improvements,
#                     'suggestions':          r.suggestions,
#                 }
#             })

#         return Response({
#             'id':           s.session_id,
#             'role':         s.role,
#             'date':         s.completed_at.isoformat(),
#             'averageScore': int(s.average_score),
#             'status':       'completed',
#             'responses':    responses,
#         })


# class ClearSessionsView(APIView):
#     def delete(self, request, user_id):
#         try:
#             user = User.objects.get(id=user_id)
#             InterviewSession.objects.filter(user=user).delete()
#             return Response({'status': 'cleared'})
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=404)


# class AdminPerformanceView(APIView):
#     def get(self, request):
#         from django.db.models import Avg, Max

#         users = User.objects.filter(sessions__isnull=False).distinct()

#         candidates = []
#         for u in users:
#             user_sessions = InterviewSession.objects.filter(user=u)
#             avg  = user_sessions.aggregate(avg=Avg('average_score'))['avg'] or 0
#             best = user_sessions.aggregate(best=Max('average_score'))['best'] or 0
#             avg  = round(avg)
#             best = round(best)
#             band = (
#                 "Excellent" if avg >= 80 else
#                 "Good"      if avg >= 65 else
#                 "Average"   if avg >= 45 else
#                 "Needs Work"
#             )
#             roles = list(user_sessions.values_list('role', flat=True).distinct())
#             sessions_data = []
#             for s in user_sessions.order_by('-completed_at'):
#                 sessions_data.append({
#                     'sessionId':     s.session_id,
#                     'role':          s.role,
#                     'date':          s.completed_at.strftime('%Y-%m-%d'),
#                     'averageScore':  round(s.average_score),
#                     'questionCount': s.responses.count(),
#                 })
#             candidates.append({
#                 'id':             u.id,
#                 'name':           u.username,
#                 'overallAverage': avg,
#                 'bestScore':      best,
#                 'totalSessions':  user_sessions.count(),
#                 'roles':          roles,
#                 'band':           band,
#                 'sessions':       sessions_data,
#             })

#         candidates.sort(key=lambda x: x['overallAverage'], reverse=True)

#         all_sessions    = InterviewSession.objects.all()
#         total_sessions  = all_sessions.count()
#         overall_avg     = all_sessions.aggregate(avg=Avg('average_score'))['avg'] or 0
#         top_score       = all_sessions.aggregate(best=Max('average_score'))['best'] or 0

#         role_counts = {}
#         for s in all_sessions:
#             role_counts[s.role] = role_counts.get(s.role, 0) + 1
#         roles_data = [{'role': r, 'count': c} for r, c in role_counts.items()]

#         return Response({
#             'candidates': candidates,
#             'summary': {
#                 'total_candidates': users.count(),
#                 'total_sessions':   total_sessions,
#                 'average_score':    round(overall_avg),
#                 'top_score':        round(top_score),
#                 'roles':            roles_data,
#             }
#         })
# class AnalyzeFrameView(APIView):
#     def post(self, request):
#         image = request.data.get('frame', '')
#         if not image:
#             return Response({'error': 'No frame provided'}, status=400)
#         result = analyze_frame(image)
#         return Response(result)
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import AIEvaluationLog, InterviewSession, QuestionResponse
from .ml_scorer import predict_scores
from .video_analyzer import analyze_frame
from accounts.models import User


class EvaluateAnswerView(APIView):
    def post(self, request):
        question_data   = request.data.get('question', {})
        answer          = request.data.get('answer', '')
        question_text   = question_data.get('text', '')
        expected_topics = question_data.get('expectedTopics', [])

        if not question_text or not answer:
            return Response({'error': 'question and answer are required'}, status=400)

        scores = predict_scores(
            question=question_text,
            topics=expected_topics,
            answer=answer,
        )

        result = {
            'relevance':            scores['relevance_score'],
            'technicalAccuracy':    scores['technical_score'],
            'communicationClarity': scores['communication_score'],
            'overallScore':         scores['overall_score'],
            'strengths':            scores['strengths'],
            'improvements':         scores['improvements'],
            'suggestions':          scores['suggestions'],
            'coveredTopics':        scores.get('covered_topics', []),
            'missingTopics':        scores.get('missing_topics', []),
            'validity':             scores.get('validity', {'valid': True, 'reason': 'OK', 'penalty': 0.0}),
        }

        AIEvaluationLog.objects.create(
            question_text=question_text,
            expected_topics=expected_topics,
            answer=answer,
            response_json=result,
        )

        return Response(result)


class AnalyzeFrameView(APIView):
    def post(self, request):
        image = request.data.get('frame', '')
        if not image:
            return Response({'error': 'No frame provided'}, status=400)
        result = analyze_frame(image)
        return Response(result)


class SaveSessionView(APIView):
    def post(self, request):
        data    = request.data
        user_id = data.get('userId')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        video = data.get('videoScores', {}) or {}

        session = InterviewSession.objects.create(
            user=user,
            session_id=data['id'],
            role=data.get('role', ''),
            average_score=data.get('averageScore', 0),
            eye_contact_score=video.get('eyeContactScore', 0),
            posture_score=video.get('postureScore', 0),
            video_confidence=video.get('confidenceScore', 0),
        )

        for resp in data.get('responses', []):
            feedback = resp.get('feedback', {})
            QuestionResponse.objects.create(
                session=session,
                question_id=str(resp.get('questionId', '')),
                question_text=resp.get('questionText', ''),
                answer=resp.get('answer', ''),
                relevance=feedback.get('relevance', 0),
                technical_accuracy=feedback.get('technicalAccuracy', 0),
                communication_clarity=feedback.get('communicationClarity', 0),
                overall_score=feedback.get('overallScore', 0),
                strengths=feedback.get('strengths', []),
                improvements=feedback.get('improvements', []),
                suggestions=feedback.get('suggestions', []),
            )

        return Response({'status': 'saved', 'sessionId': session.session_id})


class GetSessionsView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        sessions = InterviewSession.objects.filter(user=user).order_by('-completed_at')
        data = []
        for s in sessions:
            responses = []
            for r in s.responses.all():
                responses.append({
                    'questionId':   int(r.question_id) if r.question_id.isdigit() else r.question_id,
                    'questionText': r.question_text,
                    'answer':       r.answer,
                    'score':        r.overall_score,
                    'feedback': {
                        'relevance':            r.relevance,
                        'technicalAccuracy':    r.technical_accuracy,
                        'communicationClarity': r.communication_clarity,
                        'overallScore':         r.overall_score,
                        'strengths':            r.strengths,
                        'improvements':         r.improvements,
                        'suggestions':          r.suggestions,
                    }
                })
            data.append({
                'id':           s.session_id,
                'role':         s.role,
                'date':         s.completed_at.isoformat(),
                'averageScore': int(s.average_score),
                'status':       'completed',
                'responses':    responses,
                'videoScores': {
                    'eyeContactScore': s.eye_contact_score,
                    'postureScore':    s.posture_score,
                    'confidenceScore': s.video_confidence,
                },
            })

        return Response(data)


class GetSessionDetailView(APIView):
    def get(self, request, session_id):
        try:
            s = InterviewSession.objects.get(session_id=session_id)
        except InterviewSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)

        responses = []
        for r in s.responses.all():
            responses.append({
                'questionId':   int(r.question_id) if r.question_id.isdigit() else r.question_id,
                'questionText': r.question_text,
                'answer':       r.answer,
                'score':        r.overall_score,
                'feedback': {
                    'relevance':            r.relevance,
                    'technicalAccuracy':    r.technical_accuracy,
                    'communicationClarity': r.communication_clarity,
                    'overallScore':         r.overall_score,
                    'strengths':            r.strengths,
                    'improvements':         r.improvements,
                    'suggestions':          r.suggestions,
                }
            })

        return Response({
            'id':           s.session_id,
            'role':         s.role,
            'date':         s.completed_at.isoformat(),
            'averageScore': int(s.average_score),
            'status':       'completed',
            'responses':    responses,
            'videoScores': {
                'eyeContactScore': s.eye_contact_score,
                'postureScore':    s.posture_score,
                'confidenceScore': s.video_confidence,
            },
        })


class ClearSessionsView(APIView):
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            InterviewSession.objects.filter(user=user).delete()
            return Response({'status': 'cleared'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


class AdminPerformanceView(APIView):
    def get(self, request):
        from django.db.models import Avg, Max

        users = User.objects.filter(sessions__isnull=False).distinct()

        candidates = []
        for u in users:
            user_sessions = InterviewSession.objects.filter(user=u)
            avg  = user_sessions.aggregate(avg=Avg('average_score'))['avg'] or 0
            best = user_sessions.aggregate(best=Max('average_score'))['best'] or 0
            avg  = round(avg)
            best = round(best)
            band = (
                "Excellent" if avg >= 80 else
                "Good"      if avg >= 65 else
                "Average"   if avg >= 45 else
                "Needs Work"
            )
            roles = list(user_sessions.values_list('role', flat=True).distinct())
            sessions_data = []
            for s in user_sessions.order_by('-completed_at'):
                sessions_data.append({
                    'sessionId':       s.session_id,
                    'role':            s.role,
                    'date':            s.completed_at.strftime('%Y-%m-%d'),
                    'averageScore':    round(s.average_score),
                    'questionCount':   s.responses.count(),
                    'eyeContact':      s.eye_contact_score,
                    'posture':         s.posture_score,
                    'videoConfidence': s.video_confidence,
                })
            candidates.append({
                'id':             u.id,
                'name':           u.username,
                'overallAverage': avg,
                'bestScore':      best,
                'totalSessions':  user_sessions.count(),
                'roles':          roles,
                'band':           band,
                'sessions':       sessions_data,
            })

        candidates.sort(key=lambda x: x['overallAverage'], reverse=True)

        all_sessions   = InterviewSession.objects.all()
        total_sessions = all_sessions.count()
        overall_avg    = all_sessions.aggregate(avg=Avg('average_score'))['avg'] or 0
        top_score      = all_sessions.aggregate(best=Max('average_score'))['best'] or 0

        role_counts = {}
        for s in all_sessions:
            role_counts[s.role] = role_counts.get(s.role, 0) + 1
        roles_data = [{'role': r, 'count': c} for r, c in role_counts.items()]

        return Response({
            'candidates': candidates,
            'summary': {
                'total_candidates': users.count(),
                'total_sessions':   total_sessions,
                'average_score':    round(overall_avg),
                'top_score':        round(top_score),
                'roles':            roles_data,
            }
        })
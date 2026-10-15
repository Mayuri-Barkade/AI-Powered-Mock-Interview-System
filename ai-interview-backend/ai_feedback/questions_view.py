import csv
import random
import os
from rest_framework.views import APIView
from rest_framework.response import Response

CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'interview_questions.csv')

_QUESTION_CACHE = None

def get_questions():
    global _QUESTION_CACHE
    if _QUESTION_CACHE is None:
        questions = []
        seen = set()
        with open(CSV_PATH, newline='', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                key = (row['role'], row['question'])
                if key in seen:
                    continue
                seen.add(key)
                questions.append({
                    'id':             int(row['question_id']),
                    'role':           row['role'],
                    'category':       row['category'],
                    'question':       row['question'],
                    'difficulty':     row['difficulty'],
                    'expectedTopics': [t.strip() for t in row['expected_topics'].split(',')],
                })
        _QUESTION_CACHE = questions
    return _QUESTION_CACHE


class GetQuestionsView(APIView):
    """
    GET /api/questions/?role=software_developer&count=5
    """
    def get(self, request):
        role  = request.query_params.get('role', '').strip()
        count = int(request.query_params.get('count', 5))
        count = max(1, min(count, 15))

        if not role:
            return Response({'error': 'role is required'}, status=400)

        all_questions  = get_questions()
        role_questions = [q for q in all_questions if q['role'] == role]

        if not role_questions:
            return Response({'error': f'No questions found for role: {role}'}, status=404)

        selected = random.sample(role_questions, min(count, len(role_questions)))
        return Response({'role': role, 'count': len(selected), 'questions': selected})
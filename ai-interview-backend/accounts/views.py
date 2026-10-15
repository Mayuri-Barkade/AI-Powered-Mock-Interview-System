from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User
from .serializers import RegisterSerializer, UserSerializer


# class RegisterView(APIView):
#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response(
#                 UserSerializer(user).data,
#                 status=status.HTTP_201_CREATED
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         # authenticate() uses USERNAME_FIELD which is email
#         user = authenticate(request, username=email, password=password)

#         if user is None:
#             return Response(
#                 {'error': 'Invalid email or password'},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         return Response(UserSerializer(user).data)
class LoginView(APIView):
    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')
        user     = authenticate(request, username=email, password=password)

        if user is None:
            return Response({'error': 'Invalid email or password'}, status=401)

        return Response({
            'id':       user.id,
            'username': user.username,
            'email':    user.email,
            'is_staff': user.is_staff,   # ← add this
        })


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id':       user.id,
                'username': user.username,
                'email':    user.email,
                'is_staff': user.is_staff,   # ← add this
            }, status=201)
        return Response(serializer.errors, status=400)
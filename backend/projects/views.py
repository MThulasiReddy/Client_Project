from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ProjectRequest, HeroAnnouncement
from .serializers import (
    ProjectRequestSerializer,
    AdminProjectSerializer,
    FeedbackSubmissionSerializer,
    HeroAnnouncementSerializer,
)
from accounts.models import StudentProfile


def broadcast(project):
    payload = {
        'type': 'project.updated',
        'project_id': project.id,
        'status': project.status,
        'rating': project.rating,
    }
    layer = get_channel_layer()
    if layer:
        async_to_sync(layer.group_send)(
            f'project_updates_{project.student_id}',
            {'type': 'project.update', 'payload': payload},
        )
        async_to_sync(layer.group_send)(
            'project_updates_admin',
            {'type': 'project.update', 'payload': payload},
        )


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectRequestSerializer

    def get_queryset(self):
        return ProjectRequest.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        phone = serializer.validated_data['phone']
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user, defaults={'phone': phone}
        )
        if not created and profile.phone != phone:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'phone': 'Use the phone number already linked to your account.'})
        broadcast(serializer.save(student=self.request.user))


class AdminProjectListView(generics.ListAPIView):
    queryset = ProjectRequest.objects.select_related('student').all()
    serializer_class = AdminProjectSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminProjectDetailView(generics.RetrieveUpdateAPIView):
    queryset = ProjectRequest.objects.select_related('student').all()
    serializer_class = AdminProjectSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_update(self, serializer):
        project = serializer.instance
        extra = {}
        # Track when team responds for the first time
        if not project.admin_responded_at:
            extra['admin_responded_at'] = timezone.now()

        updated_project = serializer.save(**extra)
        broadcast(updated_project)


class ProjectFeedbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        project = get_object_or_404(ProjectRequest, pk=pk, student=request.user)
        serializer = FeedbackSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project.rating = serializer.validated_data['rating']
        project.feedback = serializer.validated_data['feedback']
        project.feedback_at = timezone.now()
        project.save(update_fields=['rating', 'feedback', 'feedback_at', 'updated_at'])

        broadcast(project)

        return Response(
            ProjectRequestSerializer(project, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )


class HeroAnnouncementView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        announcement, _ = HeroAnnouncement.objects.get_or_create(
            id=1,
            defaults={
                'title': 'PROVEN TRACK RECORD',
                'text': 'We did 100+ projects as of now, 200+ clients satisfied across colleges!',
                'stats_badge': '100+ Projects Completed · 200+ Satisfied Students',
            },
        )
        serializer = HeroAnnouncementSerializer(announcement)
        return Response(serializer.data)

    def patch(self, request):
        announcement, _ = HeroAnnouncement.objects.get_or_create(id=1)
        serializer = HeroAnnouncementSerializer(announcement, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

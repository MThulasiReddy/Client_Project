from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import generics, permissions
from .models import ProjectRequest
from .serializers import ProjectRequestSerializer, AdminProjectSerializer
from accounts.models import StudentProfile

def broadcast(project):
    payload = {'type': 'project.updated', 'project_id': project.id, 'status': project.status}
    layer = get_channel_layer()
    async_to_sync(layer.group_send)(f'project_updates_{project.student_id}', {'type': 'project.update', 'payload': payload})
    async_to_sync(layer.group_send)('project_updates_admin', {'type': 'project.update', 'payload': payload})
class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectRequestSerializer
    def get_queryset(self): return ProjectRequest.objects.filter(student=self.request.user)
    def perform_create(self, serializer):
        phone = serializer.validated_data['phone']
        profile, created = StudentProfile.objects.get_or_create(user=self.request.user, defaults={'phone': phone})
        if not created and profile.phone != phone:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'phone': 'Use the phone number already linked to your account.'})
        broadcast(serializer.save(student=self.request.user))
class AdminProjectListView(generics.ListAPIView):
    queryset, serializer_class, permission_classes = ProjectRequest.objects.select_related('student').all(), AdminProjectSerializer, [permissions.IsAdminUser]
class AdminProjectDetailView(generics.RetrieveUpdateAPIView):
    queryset, serializer_class, permission_classes = ProjectRequest.objects.select_related('student').all(), AdminProjectSerializer, [permissions.IsAdminUser]
    def perform_update(self, serializer): broadcast(serializer.save())

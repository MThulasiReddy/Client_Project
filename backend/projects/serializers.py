from rest_framework import serializers
from .models import ProjectRequest, HeroAnnouncement
from accounts.serializers import UserSerializer
from accounts.models import StudentProfile, phone_validator


class ProjectRequestSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    status_label = serializers.CharField(source='get_status_display', read_only=True)
    category_label = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = ProjectRequest
        fields = '__all__'
        read_only_fields = (
            'student',
            'status',
            'quote',
            'admin_note',
            'created_at',
            'updated_at',
            'admin_responded_at',
            'rating',
            'feedback',
            'feedback_at',
        )

    def validate_phone(self, value):
        phone_validator(value)
        owner = StudentProfile.objects.filter(phone=value).select_related('user').first()
        if owner and owner.user_id != self.context['request'].user.id:
            raise serializers.ValidationError('This phone number is already linked to another account.')
        return value


class AdminProjectSerializer(ProjectRequestSerializer):
    class Meta(ProjectRequestSerializer.Meta):
        read_only_fields = (
            'student',
            'created_at',
            'updated_at',
            'rating',
            'feedback',
            'feedback_at',
        )


class FeedbackSubmissionSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    feedback = serializers.CharField(required=True, allow_blank=False, max_length=2000)


class HeroAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroAnnouncement
        fields = ('id', 'title', 'text', 'stats_badge', 'updated_at')

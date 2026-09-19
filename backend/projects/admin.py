from django.contrib import admin
from .models import ProjectRequest
@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display, list_filter, search_fields = ('title', 'student', 'category', 'status', 'deadline', 'updated_at'), ('status', 'category'), ('title', 'student__email', 'college')

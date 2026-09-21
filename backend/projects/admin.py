from django.contrib import admin
from .models import ProjectRequest, PlacementCompanyLink, StudentJobApplication, HeroAnnouncement

@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display, list_filter, search_fields = ('title', 'student', 'category', 'status', 'deadline', 'updated_at'), ('status', 'category'), ('title', 'student__email', 'college')

@admin.register(PlacementCompanyLink)
class PlacementCompanyLinkAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'role_title', 'department', 'job_type', 'deadline', 'created_at')
    list_filter = ('department', 'job_type')
    search_fields = ('company_name', 'role_title', 'location')

@admin.register(StudentJobApplication)
class StudentJobApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'company_link', 'applied_at')
    list_filter = ('applied_at',)
    search_fields = ('student__email', 'company_link__company_name')

@admin.register(HeroAnnouncement)
class HeroAnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'stats_badge', 'updated_at')


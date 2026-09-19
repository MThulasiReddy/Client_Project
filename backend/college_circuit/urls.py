from django.contrib import admin
from django.urls import include, path
from django.http import FileResponse, JsonResponse
from django.views.static import serve
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import LoginView, RegisterView, MeView

def api_home(request):
    return JsonResponse({
        'name': 'College Circuit API',
        'status': 'running',
        'frontend': 'http://localhost:5173',
        'admin': '/admin/',
        'api': {'auth': '/api/auth/', 'projects': '/api/projects/'},
    })

def frontend_home(request):
    index = settings.FRONTEND_DIST_DIR / 'index.html'
    if index.exists():
        return FileResponse(index.open('rb'), content_type='text/html')
    return api_home(request)

urlpatterns = [path('', frontend_home), path('assets/<path:path>', serve, {'document_root': settings.FRONTEND_DIST_DIR / 'assets'}), path('api', api_home), path('api/', api_home), path('admin/', admin.site.urls), path('api/auth/register/', RegisterView.as_view()), path('api/auth/login/', LoginView.as_view()), path('api/auth/refresh/', TokenRefreshView.as_view()), path('api/auth/me/', MeView.as_view()), path('api/projects/', include('projects.urls'))]

from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.UploadView.as_view(), name='upload'),
    path('analyze/', views.AnalyzeView.as_view(), name='analyze'),
    path('jobs/', views.JobsView.as_view(), name='jobs'),
    path('interview-kit/', views.InterviewKitView.as_view(), name='interview-kit'),
    path('history/', views.HistoryView.as_view(), name='history'),
    path('compare/', views.CompareView.as_view(), name='compare'),
    path('health/', views.HealthCheckView.as_view(), name='health'),
    path('save-report/', views.SaveReportView.as_view(), name='save-report'),
    path('delete-report/', views.DeleteReportView.as_view(), name='delete-report'),
    path('user-reports/', views.UserReportsView.as_view(), name='user-reports'),
    path('report/<int:report_id>/', views.ReportDetailView.as_view(), name='report-detail'),
    path('report/by-name/', views.ReportByNameView.as_view(), name='report-by-name'),
]
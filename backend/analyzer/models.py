from django.db import models


class Resume(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.FileField(upload_to='resumes/')
    upload_date = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Resume {self.id} - {self.upload_date}"


class Job(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    salary = models.CharField(max_length=100, null=True, blank=True)
    apply_link = models.URLField()

    def __str__(self):
        return f"{self.title} at {self.company}"


class Analysis(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='analyses')
    jd = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='jd_analyses')
    match_score = models.FloatField()
    missing_skills = models.JSONField(default=list)
    extracted_skills = models.JSONField(default=list)
    semantic_similarity = models.FloatField(default=0.0)
    skill_match_score = models.FloatField(default=0.0)
    suggestions = models.JSONField(default=list)
    resume_keyword_freq = models.JSONField(default=dict)
    jd_keyword_freq = models.JSONField(default=dict)
    youtube_recommendations = models.JSONField(default=dict, help_text="YouTube recommendations for missing skills")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis {self.id} - Score: {self.match_score}%"


class ComparisonHistory(models.Model):
    analysis1 = models.ForeignKey(Analysis, on_delete=models.CASCADE, related_name='comparison1')
    analysis2 = models.ForeignKey(Analysis, on_delete=models.CASCADE, related_name='comparison2')
    score_difference = models.FloatField()
    skill_difference = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comparison {self.id}"


class SavedReport(models.Model):
    name = models.CharField(max_length=200, help_text="Name given by user for this report")
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE, related_name='saved_reports')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - Analysis {self.analysis.id}"
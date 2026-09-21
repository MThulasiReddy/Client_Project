from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class ProjectRequest(models.Model):
    class Category(models.TextChoices):
        WEB = 'web', 'Web Development'
        IOT = 'iot', 'IoT Project'
        MOBILE = 'mobile', 'Mobile App'
        AI = 'ai', 'AI / Machine Learning'
        DESIGN = 'design', 'UI / UX Design'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        RECEIVED = 'received', 'Request received'
        CONFIRMED = 'confirmed', 'Confirmed'
        DOING = 'doing', 'In progress'
        DONE = 'done', 'Done'
        DELIVERED = 'delivered', 'Delivered'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='project_requests',
    )
    title = models.CharField(max_length=160)
    category = models.CharField(max_length=20, choices=Category.choices)
    description = models.TextField()
    phone = models.CharField(max_length=25)
    college = models.CharField(max_length=160)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RECEIVED)
    quote = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    admin_note = models.TextField(blank=True)

    # Action timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    admin_responded_at = models.DateTimeField(null=True, blank=True)

    # Student feedback
    rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    feedback = models.TextField(blank=True)
    feedback_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.title} — {self.student.email}'


class HeroAnnouncement(models.Model):
    title = models.CharField(max_length=120, default="PROVEN TRACK RECORD")
    text = models.TextField(
        default="We did 100+ projects as of now, 200+ clients satisfied across colleges!"
    )
    stats_badge = models.CharField(
        max_length=100,
        default="100+ Projects Completed · 200+ Satisfied Students",
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Hero Announcement: {self.text[:40]}"


class PlacementCompanyLink(models.Model):
    class Department(models.TextChoices):
        ECE = 'ece', 'ECE (Electronics & Communication)'
        CSE = 'cse', 'CSE (Computer Science)'
        IT = 'it', 'IT (Information Technology)'
        EEE = 'eee', 'EEE (Electrical & Electronics)'

    department = models.CharField(max_length=10, choices=Department.choices)
    company_name = models.CharField(max_length=200)
    role_title = models.CharField(max_length=200)
    job_type = models.CharField(max_length=80, default='Full-time')
    apply_link = models.URLField(max_length=500)
    deadline = models.DateField(null=True, blank=True)
    batch_eligibility = models.CharField(max_length=120, blank=True)
    salary_or_stipend = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)
    click_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['deadline', '-created_at']

    def __str__(self):
        return f"[{self.department.upper()}] {self.company_name} - {self.role_title}"


class StudentJobApplication(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_applications',
    )
    company_link = models.ForeignKey(
        PlacementCompanyLink,
        on_delete=models.CASCADE,
        related_name='student_applications',
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'company_link')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.student.email} applied to {self.company_link.company_name}"


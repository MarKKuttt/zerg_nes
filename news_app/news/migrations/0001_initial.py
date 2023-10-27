# Generated by Django 4.2.4 on 2023-10-27 21:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                (
                    "slug",
                    models.SlugField(
                        max_length=255, unique=True, verbose_name="Category_url"
                    ),
                ),
            ],
            options={
                "verbose_name": "Category(s)",
                "verbose_name_plural": "Categories",
                "ordering": ["title"],
            },
        ),
        migrations.CreateModel(
            name="Tag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=50)),
                ("slug", models.SlugField(unique=True, verbose_name="Slug_url")),
            ],
            options={
                "verbose_name": "Tag",
                "verbose_name_plural": "Tags",
                "ordering": ["title"],
            },
        ),
        migrations.CreateModel(
            name="Post",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=255, verbose_name="Name")),
                (
                    "slug",
                    models.SlugField(max_length=255, unique=True, verbose_name="Link"),
                ),
                ("author", models.CharField(max_length=100, verbose_name="Author")),
                ("content", models.TextField(blank=True, verbose_name="Content")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="Published"),
                ),
                (
                    "photo",
                    models.ImageField(
                        blank=True, upload_to="photos/%Y/%m/%d/", verbose_name="Photo"
                    ),
                ),
                (
                    "views",
                    models.IntegerField(default=0, verbose_name="Number of views"),
                ),
                ("is_published", models.BooleanField(default=True)),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="posts",
                        to="news.category",
                        verbose_name="Category",
                    ),
                ),
                (
                    "tags",
                    models.ManyToManyField(
                        blank=True,
                        related_name="posts",
                        to="news.tag",
                        verbose_name="Tag",
                    ),
                ),
            ],
            options={
                "verbose_name": "Article(s)",
                "verbose_name_plural": "Articles",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="Comment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=254)),
                ("comment", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("is_published", models.BooleanField(default=True)),
                (
                    "post",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="comments",
                        to="news.post",
                    ),
                ),
            ],
        ),
    ]

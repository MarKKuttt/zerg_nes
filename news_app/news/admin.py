from django.contrib import admin
from .models import *
from django.utils.safestring import mark_safe


class PostAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    save_as = True
    save_on_top = True
    list_display = ('id', 'title', 'slug', 'category', 'author', 'created_at', 'get_photo', 'is_published')
    list_display_links = ('id', 'title')
    search_fields = ('title',)
    list_filter = ('category', 'tags', 'created_at', 'is_published')
    readonly_fields = ('views', 'created_at', 'get_photo')
    fields = ('title', 'slug', 'category', 'tags', 'content', 'author', 'photo', 'get_photo', 'views', 'created_at')

    list_editable = ('is_published',)

    def get_photo(self, obj):
        if obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" width="50">')
        return '-'
    
    get_photo.short_description = 'miniature'


class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}


class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}


class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'comment', 'username', 'email', 'created_at', 'is_published')
    list_display_links = ('id', 'username', 'post')
    list_filter = ('post', 'created_at', 'is_published', 'is_published')
    search_fields = ('username', 'email', 'post__title')
    actions = ['publish_comments', 'unpublish_comments']

    list_editable = ('is_published',)

    def publish_comments(self, request, queryset):
        queryset.update(is_published=True)
    publish_comments.short_description = "Publish selected comments"

    def unpublish_comments(self, request, queryset):
        queryset.update(is_published=False)
    unpublish_comments.short_description = "Unpublish selected comments"


admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
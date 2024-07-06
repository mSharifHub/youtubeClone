from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        ('User Name And Password', {'fields': ('username', 'password')}),
        ('Personal info',
         {'fields':
              ('first_name',
               'last_name',
               'email',
               'bio',
               'profile_picture'
               )}),
        ('Permissions',
         {'fields': ('is_active',
                     'is_verified',
                     'is_staff',
                     'is_superuser',
                     'groups',
                     'user_permissions',
                     )}),
        ('Important dates', {'fields': ('date_joined',)}),
        ('Subscriptions', {'fields': ('subscribers',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'bio', 'profile_picture'),
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)


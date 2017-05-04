# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings
import taggit.managers
import awx.main.fields


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0039_v320_data_migrations'),
    ]

    operations = [
        migrations.CreateModel(
            name='CredentialType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(default=None, editable=False)),
                ('modified', models.DateTimeField(default=None, editable=False)),
                ('description', models.TextField(default=b'', blank=True)),
                ('name', models.CharField(max_length=512)),
                ('kind', models.CharField(max_length=32, choices=[(b'ssh', 'SSH'), (b'vault', 'Vault'), (b'net', 'Network'), (b'scm', 'Source Control'), (b'cloud', 'Cloud')])),
                ('managed_by_tower', models.BooleanField(default=False, editable=False)),
                ('inputs', awx.main.fields.CredentialTypeInputField(default={}, blank=True)),
                ('injectors', awx.main.fields.CredentialTypeInjectorField(default={}, blank=True)),
                ('created_by', models.ForeignKey(related_name="{u'class': 'credentialtype', u'app_label': 'main'}(class)s_created+", on_delete=django.db.models.deletion.SET_NULL, default=None, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('modified_by', models.ForeignKey(related_name="{u'class': 'credentialtype', u'app_label': 'main'}(class)s_modified+", on_delete=django.db.models.deletion.SET_NULL, default=None, editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('tags', taggit.managers.TaggableManager(to='taggit.Tag', through='taggit.TaggedItem', blank=True, help_text='A comma-separated list of tags.', verbose_name='Tags')),
            ],
            options={
                'ordering': ('kind', 'name'),
            },
        ),
        migrations.AlterModelOptions(
            name='credential',
            options={'ordering': ('name',)},
        ),
        migrations.AddField(
            model_name='credential',
            name='inputs',
            field=awx.main.fields.CredentialInputField(default={}, blank=True),
        ),
        migrations.AddField(
            model_name='credential',
            name='credential_type',
            field=models.ForeignKey(related_name='credentials', to='main.CredentialType', null=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='job',
            name='vault_credential',
            field=models.ForeignKey(related_name='jobs_as_vault_credential+', on_delete=django.db.models.deletion.SET_NULL, default=None, blank=True, to='main.Credential', null=True),
        ),
        migrations.AddField(
            model_name='jobtemplate',
            name='vault_credential',
            field=models.ForeignKey(related_name='jobtemplates_as_vault_credential+', on_delete=django.db.models.deletion.SET_NULL, default=None, blank=True, to='main.Credential', null=True),
        ),
        migrations.AlterUniqueTogether(
            name='credential',
            unique_together=set([('organization', 'name', 'credential_type')]),
        ),

        # Connecting activity stream
        migrations.AddField(
            model_name='activitystream',
            name='credential_type',
            field=models.ManyToManyField(to='main.CredentialType', blank=True),
        ),
        migrations.AlterField(
            model_name='credential',
            name='credential_type',
            field=models.ForeignKey(related_name='credentials', to='main.CredentialType', help_text='Type for this credential.  Credential Types define valid fields (e.g,. "username", "password") and their properties (e.g,. "username is required" or "password should be stored with encryption").'),
        ),
        migrations.AlterField(
            model_name='credential',
            name='inputs',
            field=awx.main.fields.CredentialInputField(default={}, help_text='Data structure used to specify input values (e.g., {"username": "jane-doe", "password": "secret"}).  Valid fields and their requirements vary depending on the fields defined on the chosen CredentialType.', blank=True),
        ),
    ]
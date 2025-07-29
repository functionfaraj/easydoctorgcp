# EasyDoctor API - Google Cloud Deployment Guide

## Prerequisites

1. **Google Cloud SDK**: Install and configure the gcloud CLI
2. **Google Cloud Project**: Create a project with billing enabled
3. **MongoDB Database**: Set up a MongoDB instance (Atlas recommended for production)

## Quick Deployment

### Option 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Option 2: Manual Deployment

1. **Set up your Google Cloud project:**
```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

2. **Deploy using Cloud Build:**
```bash
# Update the substitution variables in cloudbuild.yaml
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_JWT_SECRET="your-jwt-secret",_MONGODB_URL="your-mongodb-url"
```

## Environment Variables

Configure these environment variables in your Cloud Run service:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `production` |
| `PORT` | Server port (automatically set by Cloud Run) | `8080` |
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | JWT signing secret | `your-secure-secret-key` |
| `JWT_EXP` | JWT expiration time | `50m` |

## Security Considerations

### 1. Database Security
- Configure MongoDB to accept connections from Cloud Run IP ranges
- Use MongoDB Atlas with IP whitelisting for enhanced security
- Enable authentication on your MongoDB instance

### 2. API Security
- Remove `--allow-unauthenticated` from cloudbuild.yaml for production
- Implement proper authentication middleware
- Use HTTPS only (Cloud Run provides this automatically)

### 3. Environment Variables
- Use Google Secret Manager for sensitive data:
```bash
# Create secrets
gcloud secrets create jwt-secret --data-file=jwt-secret.txt
gcloud secrets create mongodb-url --data-file=mongodb-url.txt

# Update Cloud Run to use secrets
gcloud run services update easydoctor-api \
  --update-secrets=JWT_SECRET=jwt-secret:latest \
  --update-secrets=MONGODB_URL=mongodb-url:latest
```

## Monitoring and Logging

### 1. Health Checks
- Health endpoint: `https://your-service-url/api/health`
- Monitor in Google Cloud Console > Cloud Run > your-service

### 2. Logs
```bash
# View real-time logs
gcloud logging tail "resource.type=cloud_run_revision"

# View logs in Cloud Console
https://console.cloud.google.com/logs
```

## Scaling Configuration

The current configuration sets:
- **Memory**: 1 GiB
- **CPU**: 1 vCPU
- **Min instances**: 0 (cold starts)
- **Max instances**: 10
- **Timeout**: 300 seconds

To modify scaling:
```bash
gcloud run services update easydoctor-api \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1 \
  --max-instances=20
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Docker build logs in Cloud Build console
   - Ensure all dependencies are in package.json
   - Verify Dockerfile syntax

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check IP whitelisting in MongoDB Atlas
   - Ensure network connectivity from Cloud Run

3. **Memory/Timeout Issues**
   - Increase memory allocation if needed
   - Optimize database queries
   - Consider caching strategies

### Useful Commands

```bash
# Check service status
gcloud run services describe easydoctor-api --region=us-central1

# Update environment variables
gcloud run services update easydoctor-api \
  --set-env-vars="JWT_SECRET=new-secret"

# View recent deployments
gcloud run revisions list --service=easydoctor-api

# Rollback to previous revision
gcloud run services update easydoctor-api \
  --to-revision=easydoctor-api-00001-abc
```

## Cost Optimization

1. **Use minimum resources**: Start with 1 CPU and 1 GiB RAM
2. **Set min instances to 0**: Allow cold starts for cost savings
3. **Monitor usage**: Use Cloud Monitoring to track requests and optimize
4. **Clean up unused images**: Regularly delete old container images

## Next Steps

1. Set up CI/CD pipeline with GitHub Actions or Cloud Build triggers
2. Implement proper authentication and authorization
3. Add API documentation with Swagger/OpenAPI
4. Set up monitoring and alerting
5. Configure custom domain and SSL
6. Implement database backups and disaster recovery

## Support

For issues with this deployment:
1. Check Cloud Build logs for build errors
2. Review Cloud Run logs for runtime errors
3. Verify environment variables and secrets
4. Test database connectivity
#!/bin/bash

# Building Management System - Deployment Script
# This script automates the deployment process on cPanel server

set -e

echo "=========================================="
echo "Starting Deployment Process"
echo "=========================================="
echo ""

# Configuration
DEPLOY_PATH="${CPANEL_DEPLOY_PATH}"
BACKUP_DIR="${CPANEL_DEPLOY_PATH}/../backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if running in correct directory
if [ ! -f "artisan" ]; then
    print_error "Error: artisan file not found. Are you in the correct directory?"
    exit 1
fi

print_status "Current directory: $(pwd)"
echo ""

# Step 1: Create backup directory if not exists
echo "Step 1: Preparing backup..."
mkdir -p "$BACKUP_DIR"
print_status "Backup directory ready"
echo ""

# Step 2: Create backup of current installation
echo "Step 2: Creating backup..."
if tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
    --exclude='storage/logs/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/cache/*' \
    --exclude='node_modules' \
    --exclude='vendor' \
    . 2>/dev/null; then
    print_status "Backup created: backup_$TIMESTAMP.tar.gz"
else
    print_warning "Backup creation failed, continuing anyway..."
fi
echo ""

# Step 3: Enable maintenance mode
echo "Step 3: Enabling maintenance mode..."
php artisan down --render="errors::503" --secret="deployment-$TIMESTAMP" || print_warning "Could not enable maintenance mode"
print_status "Maintenance mode enabled"
print_warning "Bypass URL: ${APP_URL}/deployment-$TIMESTAMP"
echo ""

# Step 4: Pull latest changes
echo "Step 4: Pulling latest changes from repository..."
if git pull origin master; then
    print_status "Code updated from repository"
else
    print_error "Git pull failed"
    php artisan up
    exit 1
fi
echo ""

# Step 5: Update Composer dependencies
echo "Step 5: Updating Composer dependencies..."
if composer install --optimize-autoloader --no-dev --no-interaction; then
    print_status "Composer dependencies updated"
else
    print_error "Composer install failed"
    php artisan up
    exit 1
fi
echo ""

# Step 6: Clear all caches
echo "Step 6: Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
print_status "All caches cleared"
echo ""

# Step 7: Run database migrations
echo "Step 7: Running database migrations..."
if php artisan migrate --force; then
    print_status "Database migrations completed"
else
    print_error "Migration failed"
    php artisan up
    exit 1
fi
echo ""

# Step 8: Optimize for production
echo "Step 8: Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer dump-autoload --optimize
print_status "Application optimized"
echo ""

# Step 9: Set correct permissions
echo "Step 9: Setting file permissions..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache
print_status "Permissions set"
echo ""

# Step 10: Verify deployment
echo "Step 10: Verifying deployment..."

# Check Laravel version
if php artisan --version >/dev/null 2>&1; then
    VERSION=$(php artisan --version)
    print_status "Laravel is running: $VERSION"
else
    print_error "Laravel verification failed"
    php artisan up
    exit 1
fi

# Check if build assets exist
if [ -f "public/build/manifest.json" ]; then
    print_status "Frontend assets verified"
else
    print_warning "Frontend assets not found (manifest.json missing)"
fi

# Check database connection
if php artisan db:show >/dev/null 2>&1; then
    print_status "Database connection verified"
else
    print_warning "Database connection check failed"
fi

echo ""

# Step 11: Disable maintenance mode
echo "Step 11: Disabling maintenance mode..."
php artisan up
print_status "Application is now live"
echo ""

# Step 12: Clean old backups (keep last 10)
echo "Step 12: Cleaning old backups..."
cd "$BACKUP_DIR"
ls -t backup_*.tar.gz | tail -n +11 | xargs -r rm --
BACKUP_COUNT=$(ls -1 backup_*.tar.gz 2>/dev/null | wc -l)
print_status "Kept last $BACKUP_COUNT backups"
echo ""

echo "=========================================="
echo -e "${GREEN}Deployment Completed Successfully!${NC}"
echo "=========================================="
echo ""
echo "Deployment Time: $(date)"
echo "Backup Location: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
echo ""
echo "Next steps:"
echo "  1. Test your application: ${APP_URL}"
echo "  2. Check logs: tail -f storage/logs/laravel.log"
echo "  3. Monitor for errors"
echo ""

exit 0

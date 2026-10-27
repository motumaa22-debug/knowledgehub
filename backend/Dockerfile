FROM php:8.2-apache

# Enable Apache mod_rewrite and headers
RUN a2enmod rewrite headers

# Install PHP extensions needed by KnowledgeHub (pdo_mysql + curl for SMS/email gateways)
RUN docker-php-ext-install pdo pdo_mysql mysqli \
    && apt-get update -qq \
    && apt-get install -y --no-install-recommends libcurl4-openssl-dev \
    && docker-php-ext-install curl \
    && rm -rf /var/lib/apt/lists/*

# ──────────────────────────────────────────────────────────────────────────────
# Apache VirtualHost — explicit config so .htaccess AllowOverride works
# ──────────────────────────────────────────────────────────────────────────────
RUN echo 'ServerName localhost\n\
<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        Options FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copy backend source into Apache web root
COPY . /var/www/html/

# Set correct permissions for storage directory
RUN mkdir -p /var/www/html/storage/uploads \
    && mkdir -p /var/www/html/storage/sent_emails \
    && chown -R www-data:www-data /var/www/html/storage \
    && chmod -R 775 /var/www/html/storage

# Expose port 80
EXPOSE 80

CMD ["apache2-foreground"]

FROM php:8.2-apache

# Enable Apache mod_rewrite for clean URLs
RUN a2enmod rewrite headers

# Install PHP extensions needed by KnowledgeHub
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Copy backend source into Apache web root
COPY . /var/www/html/

# Set correct permissions for storage directory
RUN mkdir -p /var/www/html/storage/uploads \
    && mkdir -p /var/www/html/storage/sent_emails \
    && chown -R www-data:www-data /var/www/html/storage \
    && chmod -R 775 /var/www/html/storage

# Apache config: allow .htaccess overrides and set ServerName
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/knowledgehub.conf \
    && a2enconf knowledgehub

# Expose port 80
EXPOSE 80

CMD ["apache2-foreground"]

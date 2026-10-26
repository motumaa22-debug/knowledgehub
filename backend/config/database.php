<?php
/**
 * KnowledgeHub — Database Configuration
 * Uses PDO for secure MySQL database connections.
 * 
 * Configured for local XAMPP / MySQL development.
 * Database credentials can be overridden via environment variables.
 */

class Database {
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private string $charset;
    private ?PDO $conn = null;

    public function __construct() {
        // Read configuration with safe defaults for local XAMPP
        $this->host = getenv('DB_HOST') ?: '127.0.0.1';
        $this->db_name = getenv('DB_NAME') ?: 'knowledgehub_db';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '1234';
        $this->charset = 'utf8mb4';
    }

    /**
     * Establish and return a PDO MySQL connection instance
     * 
     * @return PDO
     * @throws PDOException
     */
    public function getConnection(): PDO {
        if ($this->conn !== null) {
            return $this->conn;
        }

        $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            return $this->conn;
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status'  => 'error',
                'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP.',
                'code'    => 500
            ]);
            exit;
        }
    }
}

/**
 * Helper function to retrieve database connection
 */
function getDB(): PDO {
    static $dbInstance = null;
    if ($dbInstance === null) {
        $dbInstance = new Database();
    }
    return $dbInstance->getConnection();
}

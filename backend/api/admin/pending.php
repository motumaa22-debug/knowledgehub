<?php
/**
 * KnowledgeHub API — Admin Submissions & Queue Endpoint
 * Path: /api/admin/pending.php
 * 
 * Supports ?status=pending|approved|rejected|all (default: pending)
 * Returns rich contributor profile, submission metadata, file details, and word count.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$authUser = getAuthUser();
if (!$authUser || $authUser['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Administrator privileges required.']);
    exit;
}

$statusFilter = strtolower(trim($_GET['status'] ?? 'pending'));

// Human-readable time ago helper
function formatTimeAgo($datetime) {
    $time = strtotime($datetime);
    $diff = time() - $time;

    if ($diff < 60) return 'Just now';
    if ($diff < 3600) return floor($diff / 60) . ' mins ago';
    if ($diff < 86400) return floor($diff / 3600) . ' hours ago';
    if ($diff < 604800) return floor($diff / 86400) . ' days ago';
    return date('M j, Y \a\t g:i A', $time);
}

try {
    $pdo = getDB();

    $where = [];
    $params = [];

    if ($statusFilter !== 'all') {
        $validStatuses = ['pending', 'approved', 'rejected'];
        $cleanStatus = in_array($statusFilter, $validStatuses, true) ? $statusFilter : 'pending';
        $where[] = 'cnt.status = ?';
        $params[] = $cleanStatus;
    }

    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT 
            cnt.id,
            cnt.title,
            cnt.author_name,
            cnt.content_type,
            cnt.body_text,
            cnt.file_path,
            cnt.status,
            cnt.admin_notes,
            cnt.created_at,
            cnt.updated_at,
            cat.id AS category_id,
            cat.name AS category_name,
            cat.slug AS category_slug,
            u.id AS contributor_id,
            u.username AS contributor_username,
            u.email AS contributor_email,
            u.role AS contributor_role,
            u.created_at AS contributor_member_since,
            (SELECT COUNT(*) FROM contents WHERE user_id = u.id AND status = 'approved') AS contributor_approved_count,
            (SELECT COUNT(*) FROM contents WHERE user_id = u.id) AS contributor_total_submissions
        FROM contents cnt
        LEFT JOIN categories cat ON cat.id = cnt.category_id
        LEFT JOIN users u ON u.id = cnt.user_id
        {$whereClause}
        ORDER BY cnt.created_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $rootDir = realpath(__DIR__ . '/../../');

    // Enrich rows with file size, word counts, and readable timestamps
    $enriched = array_map(function($item) use ($rootDir) {
        $body = $item['body_text'] ?? '';
        $wordCount = $body ? str_word_count(strip_tags($body)) : 0;
        $charCount = $body ? mb_strlen(strip_tags($body)) : 0;

        $fileSizeFormatted = null;
        $fileName = null;
        $fileExists = false;

        if (!empty($item['file_path'])) {
            $fileName = basename($item['file_path']);
            $fullFilePath = $rootDir . '/' . $item['file_path'];
            if (file_exists($fullFilePath)) {
                $fileExists = true;
                $bytes = filesize($fullFilePath);
                if ($bytes >= 1048576) {
                    $fileSizeFormatted = number_format($bytes / 1048576, 2) . ' MB';
                } elseif ($bytes >= 1024) {
                    $fileSizeFormatted = number_format($bytes / 1024, 1) . ' KB';
                } else {
                    $fileSizeFormatted = $bytes . ' bytes';
                }
            }
        }

        // Trust badge for contributor
        $approvedCount = (int)$item['contributor_approved_count'];
        $trustBadge = 'New Contributor (1st Submission)';
        if ($approvedCount >= 5) {
            $trustBadge = 'Trusted Scholar (5+ Works Published)';
        } elseif ($approvedCount >= 2) {
            $trustBadge = 'Active Contributor';
        }

        return [
            'id'                       => (int)$item['id'],
            'title'                    => $item['title'],
            'author_name'              => $item['author_name'],
            'content_type'             => $item['content_type'],
            'body_text'                => $item['body_text'],
            'file_path'                => $item['file_path'],
            'file_name'                => $fileName,
            'file_size'                => $fileSizeFormatted,
            'file_exists'              => $fileExists,
            'word_count'               => $wordCount,
            'char_count'               => $charCount,
            'status'                   => $item['status'],
            'admin_notes'              => $item['admin_notes'],
            'created_at'               => $item['created_at'],
            'created_at_formatted'     => date('D, M j, Y \a\t g:i A', strtotime($item['created_at'])),
            'time_ago'                 => formatTimeAgo($item['created_at']),
            'category_id'              => (int)$item['category_id'],
            'category_name'            => $item['category_name'],
            'category_slug'            => $item['category_slug'],
            'contributor' => [
                'id'                   => (int)$item['contributor_id'],
                'username'             => $item['contributor_username'],
                'email'                => $item['contributor_email'],
                'role'                 => $item['contributor_role'],
                'member_since'         => $item['contributor_member_since'] ? date('M Y', strtotime($item['contributor_member_since'])) : 'Unknown',
                'approved_count'       => (int)$item['contributor_approved_count'],
                'total_submissions'    => (int)$item['contributor_total_submissions'],
                'trust_badge'          => $trustBadge,
            ]
        ];
    }, $rows);

    // Global dashboard statistics
    $stats = [
        'pending'  => (int)$pdo->query("SELECT COUNT(*) FROM contents WHERE status = 'pending'")->fetchColumn(),
        'approved' => (int)$pdo->query("SELECT COUNT(*) FROM contents WHERE status = 'approved'")->fetchColumn(),
        'rejected' => (int)$pdo->query("SELECT COUNT(*) FROM contents WHERE status = 'rejected'")->fetchColumn(),
        'total'    => (int)$pdo->query("SELECT COUNT(*) FROM contents")->fetchColumn(),
    ];

    echo json_encode([
        'status' => 'success',
        'count'  => count($enriched),
        'stats'  => $stats,
        'data'   => $enriched
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch admin queue: ' . $e->getMessage()]);
}

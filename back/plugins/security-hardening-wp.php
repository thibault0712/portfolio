<?php
/**
 * Plugin Name: Security Hardening WP
 * Description: Désactive XML-RPC, bloque l'énumération des utilisateurs, applique une triple couche noindex et masque l'URL d'administration.
 * Version: 1.1
 * Author: Falézan Thibault
 */

define('SHWP_LOGIN_SLUG', 'gigachad-panel');

if (!defined('ABSPATH')) {
    exit;
}

/* ==========================================================================
 1 . DÉSA*CTIVATION DE XML-RPC
 ========================================================================== */
add_filter('xmlrpc_enabled', '__return_false');

add_filter('xmlrpc_methods', function ($methods) {
    unset($methods['pingback.ping']);
    unset($methods['pingback.extensions.getPingbacks']);
    return $methods;
});

/* ==========================================================================
 2 . PROT*ECTION CONTRE L'ÉNUMÉRATION DES UTILISATEURS
 ========================================================================== */
// REST API : masque les endpoints /users aux non connectés
add_filter('rest_endpoints', function ($endpoints) {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users']);
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});

// Front-end : bloque les requêtes du type ?author=1
if (!is_admin()) {
    add_action('template_redirect', function () {
        if (isset($_GET['author']) || preg_match('/\/author\/[^\/]+/i', $_SERVER['REQUEST_URI'])) {
            wp_redirect(home_url(), 301);
            exit;
        }
    });
}

/* ==========================================================================
 3 . TRIP*LE COUCHE NOINDEX (Masquage du backend pour Google)
 ========================================================================== */
// Couche A : En-tête HTTP 'X-Robots-Tag'
add_action('send_headers', function () {
    header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet', true);
});

// Couche B : Forcer 'blog_public' à 0 (modifie le robots.txt virtuel de WP)
add_filter('pre_option_blog_public', '__return_zero');

// Couche C : Injection meta noindex HTML
add_action('wp_head', 'wp_no_robots', -9999);
add_action('login_head', 'wp_no_robots', -9999);
add_action('admin_head', 'wp_no_robots', -9999);

/* ==========================================================================
 4 . MASQ*UAGE DE L'URL DE CONNEXION (Remplacement de WPS Hide Login)
 ========================================================================== */

// Interception des requêtes d'accès
add_action('init', function () {
    $request_uri  = $_SERVER['REQUEST_URI'];
    $request_path = trim(parse_url($request_uri, PHP_URL_PATH), '/');
    $login_slug   = trim(SHWP_LOGIN_SLUG, '/');

    // 1. Accès via le slug personnalisé -> charge la page de connexion
    if ($request_path === $login_slug) {
        status_header(200);
        require_once ABSPATH . 'wp-login.php';
        exit;
    }

    // 2. Blocage des tentatives d'accès direct à wp-login.php
    if (strpos($request_uri, 'wp-login.php') !== false && $request_path !== $login_slug) {
        wp_redirect(home_url('/404'), 302);
        exit;
    }

    // 3. Redirection de /wp-admin pour les utilisateurs non connectés
    // (Conserve l'accès pour l'API REST, WPGraphQL et les requêtes AJAX)
    if (
        is_admin() &&
        !is_user_logged_in() &&
        !wp_doing_ajax() &&
        !defined('REST_REQUEST') &&
        strpos($request_uri, 'graphql') === false
    ) {
        wp_redirect(home_url('/404'), 302);
        exit;
    }
});

// Réécriture des URLs de connexion générées par WordPress (liens de deconnexion, mdp oublié, etc.)
add_filter('site_url', function ($url, $path) {
    if ($path === 'wp-login.php' || strpos($url, 'wp-login.php') !== false) {
        return home_url('/' . SHWP_LOGIN_SLUG);
    }
    return $url;
}, 10, 2);

add_filter('wp_redirect', function ($location) {
    if (strpos($location, 'wp-login.php') !== false) {
        return str_replace('wp-login.php', SHWP_LOGIN_SLUG, $location);
    }
    return $location;
}, 10, 1);

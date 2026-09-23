<?php
/**
 * Plugin Name: Optimisation WP Headless
 * Description: Nettoie le core (emojis, embeds, pingbacks) et allège l'API REST pour le mode headless.
 * Version: 1.0
 * Author: Falézan Thibault
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ==========================================================================
 * 1. DESACTIVATION DES EMOJIS
 * ========================================================================== */
add_action('init', function () {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    add_filter('tiny_mce_plugins', function ($plugins) {
        return is_array($plugins) ? array_diff($plugins, ['wpemoji']) : [];
    });
    add_filter('wp_resource_hints', function ($urls, $relation_type) {
        if ('dns-prefetch' === $relation_type) {
            $emoji_svg_url = apply_filters('emoji_svg_url', 'https://s.w.org/images/core/emoji/');
            $urls = array_diff($urls, [$emoji_svg_url]);
        }
        return $urls;
    }, 10, 2);
});

/* ==========================================================================
 * 2. DESACTIVATION DES EMBEDS
 * ========================================================================== */
add_action('init', function () {
    remove_action('rest_api_init', 'wp_oembed_register_route');
    remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);
    wp_deregister_script('wp-embed');
}, 9999);

/* ==========================================================================
 * 3. DESACTIVATION DES PINGBACKS & TRACKBACKS (Côté en-têtes)
 * ========================================================================== */
add_filter('wp_headers', function ($headers) {
    unset($headers['X-Pingback']);
    return $headers;
});

/* ==========================================================================
 * 4. NETTOYAGE DU <HEAD>
 * ========================================================================== */
add_action('init', function () {
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'shortlink_wp_head');
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
});

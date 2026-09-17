<?php
/** English URL bases for translated custom post types in Polylang Free. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'bemke_child_register_english_content_rewrites', 100 );
add_action( 'wp_loaded', 'bemke_child_flush_english_content_rewrites_once', 100 );
add_filter( 'post_type_link', 'bemke_child_english_content_permalink', 1000, 2 );

/** @return array<string, string> */
function bemke_child_english_content_url_bases() {
	return array(
		'oferta-pracy'      => 'job-offer',
		'komunikat-prasowy' => 'press-release',
		'darczynca'         => 'donor',
	);
}

function bemke_child_register_english_content_rewrites() {
	foreach ( bemke_child_english_content_url_bases() as $post_type => $english_base ) {
		add_rewrite_rule(
			'^en/' . preg_quote( $english_base, '/' ) . '/([^/]+)/?$',
			'index.php?post_type=' . $post_type . '&name=$matches[1]&lang=en',
			'top'
		);
	}
}

/** Flush only after all post types and language rewrites have been registered. */
function bemke_child_flush_english_content_rewrites_once() {
	$version = '1';
	if ( $version === get_option( 'bemke_child_english_content_rewrites_version' ) ) {
		return;
	}

	flush_rewrite_rules( false );
	update_option( 'bemke_child_english_content_rewrites_version', $version, false );
}

function bemke_child_english_content_permalink( $post_link, $post ) {
	if ( ! ( $post instanceof WP_Post ) || 'publish' !== $post->post_status || ! $post->post_name || ! function_exists( 'pll_get_post_language' ) ) {
		return $post_link;
	}

	$bases = bemke_child_english_content_url_bases();
	if ( ! isset( $bases[ $post->post_type ] ) || 'en' !== pll_get_post_language( $post->ID, 'slug' ) ) {
		return $post_link;
	}

	return home_url( user_trailingslashit( 'en/' . $bases[ $post->post_type ] . '/' . $post->post_name ) );
}

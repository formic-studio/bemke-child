<?php
/** English URL bases for translated custom post types in Polylang Free. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'bemke_child_register_english_content_rewrites', 100 );
add_action( 'wp_loaded', 'bemke_child_flush_english_content_rewrites_once', 100 );
add_filter( 'post_type_link', 'bemke_child_english_content_permalink', 1000, 2 );
add_action( 'template_redirect', 'bemke_child_redirect_old_english_content_url', 1 );

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
	$version = '2';
	if ( $version === get_option( 'bemke_child_english_content_rewrites_version' ) ) {
		return;
	}

	flush_rewrite_rules( false );
	update_option( 'bemke_child_english_content_rewrites_version', $version, false );

	if ( ! has_action( 'litespeed_purge_url' ) || ! function_exists( 'pll_get_post_language' ) ) {
		return;
	}

	$posts = get_posts( array(
		'post_type'        => array_keys( bemke_child_english_content_url_bases() ),
		'post_status'      => 'publish',
		'posts_per_page'   => -1,
		'suppress_filters' => true,
	) );
	foreach ( $posts as $post ) {
		if ( 'en' === pll_get_post_language( $post->ID, 'slug' ) ) {
			do_action( 'litespeed_purge_url', home_url( user_trailingslashit( 'en/' . $post->post_type . '/' . $post->post_name ) ) );
		}
	}
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

/** Retire the Polish URL bases only on published English entries. */
function bemke_child_redirect_old_english_content_url() {
	if ( ! is_singular( array_keys( bemke_child_english_content_url_bases() ) ) || ! function_exists( 'pll_get_post_language' ) ) {
		return;
	}

	$post = get_queried_object();
	if ( ! ( $post instanceof WP_Post ) || 'publish' !== $post->post_status || 'en' !== pll_get_post_language( $post->ID, 'slug' ) ) {
		return;
	}

	$request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '';
	$old_path     = 'en/' . $post->post_type . '/' . $post->post_name;
	if ( ! is_string( $request_path ) || trim( $request_path, '/' ) !== $old_path ) {
		return;
	}

	wp_safe_redirect( get_permalink( $post ), 301 );
	exit;
}

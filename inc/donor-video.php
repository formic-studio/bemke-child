<?php
/**
 * Donor video fields powered by Carbon Fields.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'carbon_fields_register_fields',
	'bemke_child_register_donor_video_fields'
);
add_action(
	'load-post.php',
	'bemke_child_migrate_donor_video_file_to_attachment_id'
);
add_filter(
	'body_class',
	'bemke_child_add_donor_video_body_class'
);

/**
 * Register an independent donor video metabox.
 */
function bemke_child_register_donor_video_fields() {
	if (
		! class_exists( '\Carbon_Fields\Container' ) ||
		! class_exists( '\Carbon_Fields\Field' )
	) {
		return;
	}

	\Carbon_Fields\Container::make(
		'post_meta',
		__( 'Darczyńcy – video', 'bemke-child' )
	)
		->where( 'post_type', '=', 'darczynca' )
		->set_context( 'normal' )
		->set_priority( 'high' )
		->add_fields(
			array(
				\Carbon_Fields\Field::make(
					'select',
					'bemke_donor_video_source',
					__( 'Źródło wideo', 'bemke-child' )
				)
					->set_options(
						array(
							'file'    => __( 'Plik wideo', 'bemke-child' ),
							'youtube' => __( 'Link YouTube', 'bemke-child' ),
						)
					)
					->set_default_value( 'file' )
					->set_help_text(
						__(
							'Wybierz, czy film ma pochodzić z biblioteki mediów, czy z YouTube.',
							'bemke-child'
						)
					),
				\Carbon_Fields\Field::make(
					'file',
					'bemke_donor_video_file',
					__( 'Plik wideo', 'bemke-child' )
				)
					->set_type( 'video' )
					->set_value_type( 'id' )
					->set_conditional_logic(
						array(
							array(
								'field'   => 'bemke_donor_video_source',
								'value'   => 'file',
								'compare' => '=',
							),
						)
					),
				\Carbon_Fields\Field::make(
					'oembed',
					'bemke_donor_video_youtube_url',
					__( 'Link YouTube', 'bemke-child' )
				)
					->set_help_text(
						__(
							'Wklej pełny link, np. https://www.youtube.com/watch?v=...',
							'bemke-child'
						)
					)
					->set_conditional_logic(
						array(
							array(
								'field'   => 'bemke_donor_video_source',
								'value'   => 'youtube',
								'compare' => '=',
							),
						)
					),
			)
		);
}

/**
 * Convert the previously stored file URL to an attachment ID.
 *
 * Carbon Fields needs the attachment ID to restore the selected file in the
 * post editor. Existing URL values are migrated when a donor is opened.
 */
function bemke_child_migrate_donor_video_file_to_attachment_id() {
	if (
		! function_exists( 'carbon_get_post_meta' ) ||
		! function_exists( 'carbon_set_post_meta' )
	) {
		return;
	}

	$post_id = isset( $_GET['post'] )
		? absint( wp_unslash( $_GET['post'] ) )
		: 0;

	if (
		! $post_id ||
		'darczynca' !== get_post_type( $post_id ) ||
		! current_user_can( 'edit_post', $post_id )
	) {
		return;
	}

	$stored_value = carbon_get_post_meta(
		$post_id,
		'bemke_donor_video_file'
	);

	if (
		! is_string( $stored_value ) ||
		! wp_http_validate_url( $stored_value )
	) {
		return;
	}

	$attachment_id = attachment_url_to_postid( $stored_value );

	if ( $attachment_id ) {
		carbon_set_post_meta(
			$post_id,
			'bemke_donor_video_file',
			$attachment_id
		);
	}
}

/**
 * Resolve the donor post used by Bricks dynamic data.
 *
 * @param int|string $post_id Optional donor post ID.
 * @return int
 */
function bemke_child_get_donor_video_post_id( $post_id = 0 ) {
	$post_id = absint( $post_id );

	if ( $post_id && 'darczynca' === get_post_type( $post_id ) ) {
		return $post_id;
	}

	$queried_post_id = get_queried_object_id();

	if (
		$queried_post_id &&
		'darczynca' === get_post_type( $queried_post_id )
	) {
		return $queried_post_id;
	}

	return 0;
}

/**
 * Return the selected donor video source for Bricks.
 *
 * @param int|string $post_id Optional donor post ID.
 * @return string
 */
function bemke_child_get_donor_video_source_for_bricks( $post_id = 0 ) {
	if ( ! function_exists( 'carbon_get_post_meta' ) ) {
		return '';
	}

	$post_id = bemke_child_get_donor_video_post_id( $post_id );

	if ( ! $post_id ) {
		return '';
	}

	$source = sanitize_key(
		(string) carbon_get_post_meta(
			$post_id,
			'bemke_donor_video_source'
		)
	);

	return in_array( $source, array( 'file', 'youtube' ), true )
		? $source
		: 'file';
}

/**
 * Return the donor video file URL for Bricks.
 *
 * @param int|string $post_id Optional donor post ID.
 * @return string
 */
function bemke_child_get_donor_video_file_for_bricks( $post_id = 0 ) {
	if ( ! function_exists( 'carbon_get_post_meta' ) ) {
		return '';
	}

	$post_id = bemke_child_get_donor_video_post_id( $post_id );

	if ( ! $post_id ) {
		return '';
	}

	$file_value = carbon_get_post_meta(
		$post_id,
		'bemke_donor_video_file'
	);

	if ( is_numeric( $file_value ) ) {
		$file_value = wp_get_attachment_url( absint( $file_value ) );
	}

	return esc_url_raw( (string) $file_value );
}

/**
 * Return the donor YouTube URL for Bricks.
 *
 * @param int|string $post_id Optional donor post ID.
 * @return string
 */
function bemke_child_get_donor_video_youtube_url_for_bricks( $post_id = 0 ) {
	if ( ! function_exists( 'carbon_get_post_meta' ) ) {
		return '';
	}

	$post_id = bemke_child_get_donor_video_post_id( $post_id );

	if ( ! $post_id ) {
		return '';
	}

	return esc_url_raw(
		(string) carbon_get_post_meta(
			$post_id,
			'bemke_donor_video_youtube_url'
		)
	);
}

/**
 * Return the selected donor video URL for a single Bricks Video element.
 *
 * @param int|string $post_id Optional donor post ID.
 * @return string
 */
function bemke_child_get_donor_video_url_for_bricks( $post_id = 0 ) {
	$source = bemke_child_get_donor_video_source_for_bricks( $post_id );

	if ( 'youtube' === $source ) {
		return bemke_child_get_donor_video_youtube_url_for_bricks( $post_id );
	}

	if ( 'file' === $source ) {
		return bemke_child_get_donor_video_file_for_bricks( $post_id );
	}

	return '';
}

/**
 * Hide an empty donor video block on the frontend without relying on JS.
 *
 * @param array<int, string> $classes Current body classes.
 * @return array<int, string>
 */
function bemke_child_add_donor_video_body_class( $classes ) {
	if (
		! is_singular( 'darczynca' ) ||
		(
			function_exists( 'bemke_child_is_bricks_builder_request' ) &&
			bemke_child_is_bricks_builder_request()
		)
	) {
		return $classes;
	}

	if ( '' === bemke_child_get_donor_video_url_for_bricks() ) {
		$classes[] = 'bemke-donor-video-empty';
	}

	return $classes;
}

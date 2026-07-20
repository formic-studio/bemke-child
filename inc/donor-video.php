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
					->set_value_type( 'url' )
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

	return esc_url_raw(
		(string) carbon_get_post_meta(
			$post_id,
			'bemke_donor_video_file'
		)
	);
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

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
		__( 'Darczyńcy – video (Carbon Fields)', 'bemke-child' )
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

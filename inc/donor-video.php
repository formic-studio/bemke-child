<?php
/**
 * Additional donor video fields powered by Carbon Fields.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'carbon_fields_register_fields',
	'bemke_child_extend_donor_video_fields',
	PHP_INT_MAX
);

/**
 * Add a YouTube URL field to the existing donor video metabox.
 *
 * The original container and its file field are registered outside this child
 * theme. Extending that container preserves its existing field name and data.
 */
function bemke_child_extend_donor_video_fields() {
	if (
		! class_exists( '\Carbon_Fields\Carbon_Fields' ) ||
		! class_exists( '\Carbon_Fields\Field' )
	) {
		return;
	}

	try {
		$repository = \Carbon_Fields\Carbon_Fields::resolve(
			'container_repository'
		);
	} catch ( \Throwable $exception ) {
		return;
	}

	if ( ! is_object( $repository ) || ! method_exists( $repository, 'get_containers' ) ) {
		return;
	}

	foreach ( $repository->get_containers( 'post_meta' ) as $container ) {
		if (
			! is_object( $container ) ||
			! method_exists( $container, 'get_id' ) ||
			! method_exists( $container, 'add_fields' )
		) {
			continue;
		}

		$container_id = (string) $container->get_id();

		if ( false === strpos( $container_id, 'darczyncy_video' ) ) {
			continue;
		}

		if (
			method_exists( $container, 'get_root_field_by_name' ) &&
			$container->get_root_field_by_name(
				'bemke_donor_video_youtube_url'
			)
		) {
			return;
		}

		$container->add_fields(
			array(
				\Carbon_Fields\Field::make(
					'oembed',
					'bemke_donor_video_youtube_url',
					__( 'Link YouTube (zamiast pliku)', 'bemke-child' )
				)->set_help_text(
					__(
						'Wklej pełny link do filmu YouTube, np. https://www.youtube.com/watch?v=... . Uzupełnij pole pliku albo link YouTube — nie trzeba uzupełniać obu.',
						'bemke-child'
					)
				),
			)
		);

		return;
	}
}

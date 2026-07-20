<?php
/**
 * Shared image galleries for slider post types.
 *
 * @package Bemke_Child
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'carbon_fields_register_fields',
	'bemke_child_register_slider_gallery_fields'
);
add_filter(
	'bricks/code/echo_function_names',
	'bemke_child_allow_slider_gallery_echo_functions'
);

/**
 * Return slider post types that use the shared image gallery.
 *
 * Strategia 2050 intentionally keeps its existing data structure.
 *
 * @return array<int, string>
 */
function bemke_child_get_gallery_slider_post_types() {
	$post_types = array_keys(
		bemke_child_get_slider_admin_post_types()
	);

	return array_values(
		array_diff( $post_types, array( 'strategia-2050' ) )
	);
}

/**
 * Register one unlimited, sortable image gallery field for slider posts.
 */
function bemke_child_register_slider_gallery_fields() {
	if (
		! class_exists( '\Carbon_Fields\Container' ) ||
		! class_exists( '\Carbon_Fields\Field' )
	) {
		return;
	}

	\Carbon_Fields\Container::make(
		'post_meta',
		__( 'Zdjęcia slidera', 'bemke-child' )
	)
		->where(
			'post_type',
			'IN',
			bemke_child_get_gallery_slider_post_types()
		)
		->set_context( 'normal' )
		->set_priority( 'high' )
		->add_fields(
			array(
				\Carbon_Fields\Field::make(
					'media_gallery',
					'bemke_slider_images',
					__( 'Zdjęcia slidera', 'bemke-child' )
				)
					->set_type( 'image' )
					->set_duplicates_allowed( false )
					->set_help_text(
						__(
							'Dodaj dowolną liczbę zdjęć. Kolejność możesz zmieniać przeciąganiem.',
							'bemke-child'
						)
					),
			)
		);
}

/**
 * Resolve a slider post used by Bricks dynamic data.
 *
 * @param int|string $post_id Optional slider post ID.
 * @return int
 */
function bemke_child_get_slider_gallery_post_id( $post_id = 0 ) {
	$post_id           = absint( $post_id );
	$slider_post_types = bemke_child_get_gallery_slider_post_types();

	if (
		$post_id &&
		in_array( get_post_type( $post_id ), $slider_post_types, true )
	) {
		return $post_id;
	}

	$current_post_id = get_the_ID();

	if (
		$current_post_id &&
		in_array(
			get_post_type( $current_post_id ),
			$slider_post_types,
			true
		)
	) {
		return $current_post_id;
	}

	$queried_post_id = get_queried_object_id();

	if (
		$queried_post_id &&
		in_array(
			get_post_type( $queried_post_id ),
			$slider_post_types,
			true
		)
	) {
		return $queried_post_id;
	}

	return 0;
}

/**
 * Return ordered attachment IDs from the current slider gallery.
 *
 * @param int|string $post_id Optional slider post ID.
 * @return array<int, int>
 */
function bemke_child_get_slider_images_for_bricks( $post_id = 0 ) {
	if ( ! function_exists( 'carbon_get_post_meta' ) ) {
		return array();
	}

	$post_id = bemke_child_get_slider_gallery_post_id( $post_id );

	if ( ! $post_id ) {
		return array();
	}

	$image_ids = carbon_get_post_meta(
		$post_id,
		'bemke_slider_images'
	);

	if ( ! is_array( $image_ids ) ) {
		return array();
	}

	return array_values(
		array_filter(
			array_map( 'absint', $image_ids )
		)
	);
}

/**
 * Return complete image rows for a Bricks Array Query.
 *
 * @param int|string $post_id Optional slider post ID.
 * @return array<int, array<string, int|string>>
 */
function bemke_child_get_slider_image_items_for_bricks( $post_id = 0 ) {
	$items = array();

	foreach (
		bemke_child_get_slider_images_for_bricks( $post_id )
		as $image_id
	) {
		$image_url = wp_get_attachment_image_url( $image_id, 'full' );

		if ( ! $image_url ) {
			continue;
		}

		$items[] = array(
			'bemke_slider_image_id'    => $image_id,
			'bemke_slider_image_url'   => $image_url,
			'bemke_slider_image_alt'   => (string) get_post_meta(
				$image_id,
				'_wp_attachment_image_alt',
				true
			),
			'bemke_slider_image_title' => get_the_title( $image_id ),
		);
	}

	return $items;
}

/**
 * Allow Bricks to call the slider gallery data providers.
 *
 * @param mixed $function_names Function names already allowed by Bricks.
 * @return array<int, string>
 */
function bemke_child_allow_slider_gallery_echo_functions(
	$function_names = array()
) {
	if ( ! is_array( $function_names ) ) {
		$function_names = array();
	}

	return array_values(
		array_unique(
			array_merge(
				$function_names,
				array(
					'bemke_child_get_slider_images_for_bricks',
					'bemke_child_get_slider_image_items_for_bricks',
				)
			)
		)
	);
}
